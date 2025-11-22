## Onco-Team App

Conversational assistant for oncology orientation and prevention. The app has three user-facing areas:
- **Profile** – the Companion collects/edits/confirms profile data through tools. This is the data entry flow. Changes made here or in chat stay in sync.
- **Dashboard** – read-only overview plus a modal to edit/confirm the same profile stored in AsyncStorage. 
- **Visits tab** – shows a list of suggested/placeholder check-ups (stub for now).

### Profile flow
- States: `MISSING` → onboarding (age, sex, location); `NEEDS_CONFIRMATION` → bullet summary + ask to confirm/edit; `CONFIRMED` → free conversation.
- Tools:
  - `update_profile` saves any provided fields (flat or inside `lifestyle`).
  - `confirm_profile` marks data as confirmed.
- After every update/confirm, the orchestrator builds a local bullet summary (age, sex, location, smoking, alcohol, activity, diet, BMI, family history, medical history, exposures, goals) and asks if anything should be changed.

### Dashboard (profile overview)
- Shows status, personal data, lifestyle, notes, goals.

### Chat experience
- Starts with a medical/privacy disclaimer, then the profile summary + “Do you want to edit anything? If not, tell me how I can help.”
- The traffic-light indicator reflects agent severity: GREEN (low), YELLOW (moderate), RED (urgent).
- Requests for actionable items surface `next_steps` as a bullet list.
- Keyboard is wrapped with `KeyboardAvoidingView` to keep the input visible.

### Multi-agent roles
- **Companion** (user-facing): onboarding/confirmation, small talk, patient-facing messaging; calls Sentinel only when profile is confirmed.
- **Sentinel**: analytic, risk reasoning; can call `wearable_api` and `federated_model`.
- **Executive**: only on RED; proposes actions/steps; can call `cup_api` and `calendar_api` (stub) for slots/reminders.

### Available tools (mock/stub)
- `update_profile`, `confirm_profile`
- `wearable_api`, `federated_model`
- `cup_api` (mock appointment slots)
- `calendar_api` (mock reminder event)
- `none`

### Setup
- Expo/React Native app. Requires `EXPO_PUBLIC_OPENAI_API_KEY` for agent calls.
- You can open the chat without a key for local UI tests (LLM calls will fail; rely on local profile summary and dashboard to verify flow).

### How to run
- Install deps: `npm install` (or `yarn`).
- Set env: add `EXPO_PUBLIC_OPENAI_API_KEY` to `.env` (or use a dummy key if you only test UI).
- Start: `npx expo start` (Expo), then run on simulator/device from Expo.
- If you only test UI, keep the key empty and use the dashboard/profile summary flows (LLM calls will be skipped/errored gracefully).

### Behavioral guardrails
- Patient-friendly Italian responses, calm and non-alarmist.
- No percentages of cancer risk; only qualitative assessments.
- Minimize sensitive data collection—ask only what is needed for the profile or current assessment.***
