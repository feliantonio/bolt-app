export type ProfileStatus = 'MISSING' | 'NEEDS_CONFIRMATION' | 'CONFIRMED';

export interface Profile {
    age: number | null;
    sex: 'M' | 'F' | 'Other' | 'Prefer not to say' | null;
    location: string | null;
    familyHistory: string | null;
    medicalHistory: string | null;
    lifestyle: {
        smoking: 'no' | 'ex' | 'yes' | null;
        alcohol: 'none' | 'occasional' | 'frequent' | null;
        physicalActivity: 'low' | 'medium' | 'high' | null;
        dietQuality: 'poor' | 'average' | 'good' | null;
        bmi: number | null;
    };
    exposures: string | null;
    goals: string | null;
    updatedAt: string | null; // ISO Date string
    lastConfirmedAt: string | null; // ISO Date string
}

export const INITIAL_PROFILE: Profile = {
    age: null,
    sex: null,
    location: null,
    familyHistory: null,
    medicalHistory: null,
    lifestyle: {
        smoking: null,
        alcohol: null,
        physicalActivity: null,
        dietQuality: null,
        bmi: null,
    },
    exposures: null,
    goals: null,
    updatedAt: null,
    lastConfirmedAt: null,
};
