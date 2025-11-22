import { ToolRequest } from '@/types/oncoAgent';
import { updateProfile, confirmProfile } from '../profileService';

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

    calendar_api: async (params: any) => {
        // Minimal stub to avoid missing tool errors; returns a mock booking suggestion.
        const title = params.title || 'Promemoria visita';
        const date = params.date || new Date().toISOString().slice(0, 10);
        const time = params.time || '09:00';
        return {
            success: true,
            event: {
                title,
                date,
                time,
                location: params.location || 'Da definire',
                notes: params.notes || 'Appuntamento generato automaticamente'
            }
        };
    },

    update_profile: async (params: any) => {
        try {
            const updated = await updateProfile(params);
            return { success: true, profile: updated };
        } catch (error) {
            return { error: 'Failed to update profile' };
        }
    },

    confirm_profile: async () => {
        try {
            const confirmed = await confirmProfile();
            return { success: true, profile: confirmed };
        } catch (error) {
            return { error: 'Failed to confirm profile' };
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
