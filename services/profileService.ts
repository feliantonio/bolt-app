import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile, ProfileStatus, INITIAL_PROFILE } from '@/types/profile';

const PROFILE_KEY = 'user_profile_v1';

export const loadProfile = async (): Promise<Profile> => {
    try {
        const jsonValue = await AsyncStorage.getItem(PROFILE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : INITIAL_PROFILE;
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
    const updated = {
        ...current,
        ...partialProfile,
        lifestyle: {
            ...current.lifestyle,
            ...(partialProfile.lifestyle || {}),
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
