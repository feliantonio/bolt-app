# Implementation Plan - Strict Profile Confirmation Flow

We will implement a strict profile confirmation flow to ensure the user has a valid and confirmed profile before any risk assessment is performed.

## User Review Required
> [!IMPORTANT]
> **Hard Gate**: The backend orchestrator will forcefully prevent the Companion from accessing the Sentinel agent if the profile is not in `CONFIRMED` status.
> **State Machine**: Profile status is determined by `MISSING` (no data), `NEEDS_CONFIRMATION` (incomplete/modified/unconfirmed), or `CONFIRMED`.

## Proposed Changes

### Data Layer
#### [NEW] [types/profile.ts](file:///c:/Users/franc/Documents/bolt%20app/bolt-app/types/profile.ts)
- Define `Profile` interface: `age`, `sex`, `location`, `familyHistory`, `medicalHistory`, `lifestyle` (smoking, alcohol, activity, diet, bmi), `exposures`, `goals`.
- Define `ProfileStatus`: `'MISSING' | 'NEEDS_CONFIRMATION' | 'CONFIRMED'`.

#### [NEW] [services/profileService.ts](file:///c:/Users/franc/Documents/bolt%20app/bolt-app/services/profileService.ts)
- Implement `getProfileStatus(profile)`:
    - Checks required fields (`age`, `sex`, `location`).
    - Checks `lastConfirmedAt` vs `updatedAt`.
- Implement persistence using `AsyncStorage`.

### Multi-Agent System
#### [MODIFY] [types/oncoAgent.ts](file:///c:/Users/franc/Documents/bolt%20app/bolt-app/types/oncoAgent.ts)
- Add `update_profile` to `ToolRequest`.

#### [MODIFY] [services/onco/tools.ts](file:///c:/Users/franc/Documents/bolt%20app/bolt-app/services/onco/tools.ts)
- Implement `update_profile` tool.

#### [MODIFY] [services/onco/prompts.ts](file:///c:/Users/franc/Documents/bolt%20app/bolt-app/services/onco/prompts.ts)
- Update `COMPANION_PROMPT`:
    - Add **HIGHEST PRIORITY RULE**.
    - If `MISSING`: Start onboarding.
    - If `NEEDS_CONFIRMATION`: Show summary and ask for confirmation.
    - Only if `CONFIRMED`: Allow Sentinel access.

#### [MODIFY] [services/onco/orchestrator.ts](file:///c:/Users/franc/Documents/bolt%20app/bolt-app/services/onco/orchestrator.ts)
- In `runOncoTeam`:
    - Calculate `profileStatus`.
    - **Hard Gate**: If `status != CONFIRMED`, inject system message (`ONBOARDING_START` or `CONFIRM_PROFILE`) instead of user message.
    - Force Companion to handle profile first.

### UI
#### [NEW] [app/(tabs)/dashboard.tsx](file:///c:/Users/franc/Documents/bolt%20app/bolt-app/app/(tabs)/dashboard.tsx)
- View/Edit profile.
- "Conferma dati profilo" button (updates `lastConfirmedAt`).

#### [MODIFY] [app/(tabs)/chatbot.tsx](file:///c:/Users/franc/Documents/bolt%20app/bolt-app/app/(tabs)/chatbot.tsx)
- On mount, send `__PROFILE_CHECK__` to backend to trigger the initial status check.
- Hide traffic light if not confirmed.

#### [MODIFY] [data/healthData.ts](file:///c:/Users/franc/Documents/bolt%20app/bolt-app/data/healthData.ts)
- Rename `riskPercentage` to `wellnessIndex` for UI safety.

## Verification Plan
### Manual Verification
1.  **Missing Profile**: Clear data. Open Chat. Verify "ONBOARDING_START" logic triggers Companion questions.
2.  **Confirmation**: Answer questions. Verify Companion asks for confirmation.
3.  **Gate Check**: Try to ask "Do I have cancer?" while unconfirmed. Companion should refuse and ask for confirmation.
4.  **Dashboard**: Edit profile in Dashboard. Go back to Chat. Verify status reverts to `NEEDS_CONFIRMATION`.
