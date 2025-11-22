import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile, ProfileStatus, INITIAL_PROFILE } from '@/types/profile';

const PROFILE_KEY = 'user_profile_v1';

export const loadProfile = async (): Promise<Profile> => {
    try {
        const jsonValue = await AsyncStorage.getItem(PROFILE_KEY);
        const stored = jsonValue != null ? JSON.parse(jsonValue) : {};
        return {
            ...INITIAL_PROFILE,
            ...stored,
            lifestyle: {
                ...INITIAL_PROFILE.lifestyle,
                ...(stored.lifestyle || {}),
            },
        };
    } catch (e) {
        console.error('Failed to load profile', e);
        return INITIAL_PROFILE;
    }
};

export const saveProfile = async (profile: Profile): Promise<void> => {
    try {
        const updatedProfile = {
            ...profile,
            updatedAt: new Date().toISOString(),
        };
        await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));
    } catch (e) {
        console.error('Failed to save profile', e);
    }
};

export const updateProfile = async (partialProfile: Partial<Profile>): Promise<Profile> => {
    const current = await loadProfile();
    // Accept both nested lifestyle object and flat fields for lifestyle keys
    const flatLifestyleKeys = ['smoking', 'alcohol', 'physicalActivity', 'dietQuality', 'bmi'] as const;
    const lifestyleFromFlat: Partial<Profile['lifestyle']> = {};
    flatLifestyleKeys.forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(partialProfile, key)) {
            // @ts-expect-error dynamic assign
            lifestyleFromFlat[key] = (partialProfile as any)[key];
        }
    });

    const mergedLifestyle = {
        ...current.lifestyle,
        ...lifestyleFromFlat,
        ...(partialProfile.lifestyle || {}),
    };

    const rawAge = partialProfile.age !== undefined ? partialProfile.age : current.age;
    const normalizedAge = typeof rawAge === 'string' ? parseInt(rawAge, 10) : rawAge;

    const rawBmi = mergedLifestyle.bmi;
    const normalizedBmi =
        rawBmi === '' || rawBmi === null || rawBmi === undefined
            ? null
            : typeof rawBmi === 'string'
                ? (() => {
                    const num = parseFloat(rawBmi);
                    return Number.isNaN(num) ? current.lifestyle.bmi : num;
                })()
                : rawBmi;

    const updated = {
        ...current,
        ...partialProfile,
        age: Number.isNaN(normalizedAge as any) ? current.age : normalizedAge,
        location: partialProfile.location !== undefined && partialProfile.location !== null
            ? partialProfile.location.trim()
            : current.location,
        lifestyle: {
            ...mergedLifestyle,
            bmi: normalizedBmi,
        },
        updatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    return updated;
};

export const confirmProfile = async (): Promise<Profile> => {
    const current = await loadProfile();
    const confirmed = {
        ...current,
        lastConfirmedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(confirmed));
    return confirmed;
};

export const clearProfile = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(PROFILE_KEY);
    } catch (e) {
        console.error('Failed to clear profile', e);
    }
};

export const getProfileStatus = (profile: Profile): ProfileStatus => {
    // 1. Check if profile exists (basic check if age/sex/location are set)
    if (!profile.age || !profile.sex || !profile.location) {
        return 'MISSING';
    }

    // 2. Check confirmation
    if (!profile.lastConfirmedAt) {
        return 'NEEDS_CONFIRMATION';
    }

    // 3. Check if modified since last confirmation
    if (profile.updatedAt && new Date(profile.updatedAt) > new Date(profile.lastConfirmedAt)) {
        return 'NEEDS_CONFIRMATION';
    }

    return 'CONFIRMED';
};
