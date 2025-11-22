# Task: Implement Strict Profile Confirmation Flow

## Data & Logic
- [ ] Define `Profile` interface and `ProfileStatus` ('MISSING' | 'NEEDS_CONFIRMATION' | 'CONFIRMED') in `types/profile.ts` <!-- id: 0 -->
- [ ] Implement `services/profileService.ts` with `getProfileStatus` logic and persistence <!-- id: 1 -->

## Multi-Agent Updates
- [ ] Update `types/oncoAgent.ts` to include `update_profile` tool and `profile_status` in context <!-- id: 2 -->
- [ ] Implement `update_profile` tool in `services/onco/tools.ts` <!-- id: 3 -->
- [ ] Update `COMPANION_PROMPT` in `services/onco/prompts.ts` with HIGHEST PRIORITY RULE for profile status <!-- id: 4 -->
- [ ] Update `runOncoTeam` in `services/onco/orchestrator.ts` to implement the "Hard Gate" logic <!-- id: 5 -->

## UI Implementation
- [ ] Create `app/(tabs)/dashboard.tsx` for Profile Dashboard (View/Edit/Confirm) <!-- id: 6 -->
- [ ] Update `app/(tabs)/_layout.tsx` to include the Dashboard tab <!-- id: 7 -->
- [ ] Update `app/(tabs)/chatbot.tsx` to handle `__PROFILE_CHECK__` and display traffic light only when confirmed <!-- id: 8 -->
- [ ] Update `data/healthData.ts` to rename "riskPercentage" to "wellnessIndex" (UI Safety) <!-- id: 9 -->

## Verification
- [ ] Verify MISSING status triggers onboarding <!-- id: 10 -->
- [ ] Verify NEEDS_CONFIRMATION triggers summary and confirm request <!-- id: 11 -->
- [ ] Verify CONFIRMED status allows risk assessment <!-- id: 12 -->
- [ ] Verify Dashboard updates `updatedAt` and confirmation button updates `lastConfirmedAt` <!-- id: 13 -->
