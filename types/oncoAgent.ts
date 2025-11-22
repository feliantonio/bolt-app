export type AgentRole = 'COMPANION' | 'SENTINEL' | 'EXECUTIVE';
export type MessageType = 'user_reply' | 'risk_report' | 'action_request' | 'action_plan' | 'tool_request' | 'clarification';
export type TrafficLight = 'GREEN' | 'YELLOW' | 'RED' | 'UNKNOWN';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'NEEDS_MEDICAL_REVIEW';

export interface RiskSummary {
    level: RiskLevel;
    drivers: string[];
    red_flags: string[];
}

export interface Recommendations {
    risk_summary?: RiskSummary;
    recommendations?: Recommendations;
    next_steps?: string[];
    messages_for_user?: string[];
    questions_for_user?: string[];
    tool_request?: ToolRequest;
    handoff_to: AgentRole | 'none';
}

export interface ToolRequest {
    tool_name: 'wearable_api' | 'federated_model' | 'cup_api' | 'calendar_api' | 'update_profile' | 'confirm_profile' | 'none';
    params: any;
}

export interface OncoTeamResponse {
    text: string;
    traffic_light: TrafficLight;
    debug_info?: any;
}
