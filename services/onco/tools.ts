import { ToolRequest } from '@/types/oncoAgent';
import { updateProfile } from '../profileService';

export const mockTools: Record<string, (params: any) => Promise<any>> = {
    wearable_api: async (params: any) => {
        return {
            steps_avg: 8500,
            sleep_avg_hours: 6.5,
            hr_resting: 72,
            activity_level: 'moderate',
            last_sync: new Date().toISOString()
        };
    },

    federated_model: async (params: any) => {
        // Returns a qualitative score, not to be shown to user directly
        return {
            risk_score_qualitative: 'low-moderate',
            confidence: 0.85,
            model_version: 'v2.1-polito'
        };
    },

    cup_api: async (params: any) => {
        const city = params.city || 'Torino';
        const specialty = params.specialty || 'Oncologia';
        return {
            available_slots: [
                { date: '2025-11-25', time: '10:00', facility: `Ospedale Molinette - ${city}`, doctor: 'Dr. Rossi' },
                { date: '2025-11-26', time: '14:30', facility: `Ospedale San Giovanni - ${city}`, doctor: 'Dr. Bianchi' }
            ]
        };
    },

    update_profile: async (params: any) => {
        try {
            const updated = await updateProfile(params);
            return { success: true, profile: updated };
        } catch (error) {
            return { error: 'Failed to update profile' };
        }
    }
};

export async function executeTool(toolRequest: ToolRequest) {
    const toolFn = mockTools[toolRequest.tool_name];
    if (!toolFn) {
        console.warn(`Tool ${toolRequest.tool_name} not found`);
        return { error: 'Tool not found' };
    }

    console.log(`Executing tool: ${toolRequest.tool_name} with params:`, toolRequest.params);
    return await toolFn(toolRequest.params);
}
