import 'react-native-url-polyfill/auto';
import OpenAI from 'openai';
import { AgentMessage, OncoTeamResponse, AgentRole } from '@/types/oncoAgent';
import { COMPANION_PROMPT, SENTINEL_PROMPT, EXECUTIVE_PROMPT } from './prompts';
import { executeTool } from './tools';
import { loadProfile, getProfileStatus } from '@/services/profileService';

const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

const openai = new OpenAI({
    apiKey: apiKey || 'dummy-key',
    dangerouslyAllowBrowser: true,
});

async function callAgent(
    role: AgentRole,
    systemPrompt: string,
    userContent: string,
    context: any[] = []
): Promise<AgentMessage> {
    if (!apiKey) throw new Error('OpenAI API Key missing');

    try {
        const messages = [
            { role: 'system', content: systemPrompt },
            ...context.map(m => ({ role: 'user', content: JSON.stringify(m) })), // Pass previous agent outputs as context
            { role: 'user', content: userContent }
        ];

        console.log(`Calling Agent: ${role}`);

        const response = await openai.chat.completions.create({
            model: 'gpt-4o', // Using a capable model for JSON adherence
            messages: messages as any,
            response_format: { type: 'json_object' },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error('No content from agent');

        return JSON.parse(content) as AgentMessage;
    } catch (error) {
        console.error(`Error calling agent ${role}:`, error);
        // Fallback error message
        return {
            agent: role,
            type: 'user_reply',
            traffic_light: 'UNKNOWN',
            messages_for_user: ['Si è verificato un errore tecnico. Riprova più tardi.'],
            handoff_to: 'none'
        };
    }
}



export async function runOncoTeam(
    userId: string,
    userMessage: string,
    history: any[] = []
): Promise<OncoTeamResponse> {
    // 1. Load Profile and Check Status
    const profile = await loadProfile();
    const profileStatus = getProfileStatus(profile);

    console.log('--- Starting OncoTeam Run ---');
    console.log('Profile Status:', profileStatus);

    let currentAgent: AgentRole = 'COMPANION';
    let loopCount = 0;
    const maxLoops = 5;

    // Context to pass between agents in this run
    const runContext: any[] = [
        ...history,
        { role: 'system', content: `User Profile Status: ${profileStatus}. Profile Data: ${JSON.stringify(profile)}` }
    ];
    let lastAgentResponse: AgentMessage | null = null;
    let currentInput = userMessage;

    // 2. HARD GATE LOGIC
    // If profile is not CONFIRMED, we intercept the user message (unless it's a tool response)
    // and force the Companion to focus on onboarding/confirmation.
    // We only do this interception if the currentInput is the initial user message.
    if (profileStatus !== 'CONFIRMED' && currentInput === userMessage) {
        if (profileStatus === 'MISSING') {
            // Inject system instruction to start onboarding
            currentInput = "SYSTEM_INSTRUCTION: The user profile is MISSING. Start the onboarding process by asking for Age, Sex, and Location. Do not answer other questions.";
        } else if (profileStatus === 'NEEDS_CONFIRMATION') {
            // Inject system instruction to ask for confirmation
            currentInput = "SYSTEM_INSTRUCTION: The user profile NEEDS_CONFIRMATION. Show the summary of what you know and ask the user to confirm or edit. Do not answer other questions until confirmed.";
        }
        // Force Companion
        currentAgent = 'COMPANION';
    }

    while (loopCount < maxLoops) {
        loopCount++;

        let prompt = '';
        if (currentAgent === 'COMPANION') prompt = COMPANION_PROMPT;
        else if (currentAgent === 'SENTINEL') prompt = SENTINEL_PROMPT;
        else if (currentAgent === 'EXECUTIVE') prompt = EXECUTIVE_PROMPT;

        // Call the current agent
        const response = await callAgent(currentAgent, prompt, currentInput, runContext);
        lastAgentResponse = response;
        runContext.push({ from: currentAgent, content: response });

        console.log(`Agent ${currentAgent} replied:`, response.type);

        // Handle Tool Requests
        if (response.tool_request && response.tool_request.tool_name !== 'none') {
            const toolResult = await executeTool(response.tool_request);
            // Add tool result to context for the next iteration (likely same agent or next)
            runContext.push({ from: 'TOOL', content: toolResult });
            // We might want to re-call the same agent with the tool result, 
            // but for simplicity in this loop, we let the handoff logic decide or re-prompt.
            // If the agent requested a tool, it usually expects the result. 
            // Let's assume the agent handles the flow via handoff or we re-call.
            // For this MVP, if tool is used, we treat it as input for the next step.
            currentInput = `Tool Result: ${JSON.stringify(toolResult)}`;
        } else {
            currentInput = `Previous agent output: ${JSON.stringify(response)}`;
        }

        // Handle Handoffs
        if (response.handoff_to && response.handoff_to !== 'none') {
            currentAgent = response.handoff_to;
            console.log(`Handoff to: ${currentAgent}`);
            continue;
        }

        // If no handoff, check if we are done.
        // Companion usually ends the conversation with a user_reply.
        if (currentAgent === 'COMPANION' && response.type === 'user_reply') {
            break;
        }

        // Safety break if no handoff but not companion reply (shouldn't happen with good prompts)
        if (response.handoff_to === 'none' && currentAgent !== 'COMPANION') {
            // Force handoff back to companion to close loop
            currentAgent = 'COMPANION';
        }
    }

    // Final response construction
    const finalMessage = lastAgentResponse?.messages_for_user?.[0] || 'Non ho capito, puoi ripetere?';
    const trafficLight = lastAgentResponse?.traffic_light || 'UNKNOWN';

    return {
        text: finalMessage,
        traffic_light: trafficLight,
        debug_info: runContext
    };
}

export async function runDemo() {
    console.log('Running Demo Cases...');

    const cases = [
        { msg: "Mi sento bene, faccio sport 3 volte a settimana.", label: "LOW RISK" },
        { msg: "Ho un po' di tosse da mesi e fumo un pacchetto al giorno.", label: "MEDIUM/HIGH RISK" },
        { msg: "Ho notato del sangue nelle urine ieri.", label: "RED FLAG" }
    ];

    for (const c of cases) {
        console.log(`\n\n=== DEMO CASE: ${c.label} ===`);
        console.log(`User: ${c.msg}`);
        const res = await runOncoTeam('demo-user', c.msg);
        console.log('Final Response:', res.text);
        console.log('Traffic Light:', res.traffic_light);
    }
}
