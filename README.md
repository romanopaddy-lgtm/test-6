Panda — Step 1 (Translations A1)
================================
This package contains a minimal Vite + React project implementing Step 1: Translations ENG↔ITA (A1 dataset).
Upload the zip to StackBlitz or run locally:

npm install
npm run dev

Open /translations/a1 route to start exercises.


Step 2 — Adaptive Difficulty (EMA)
----------------------------------
- Added `useAdaptiveDifficulty` hook with EMA-based level mapping (A1→C2).
- Added LocalStorage-backed `progressService` to persist EMA per category.
- Updated TranslationExercise to support 'Adaptive' mode and record results.
- Added minimal A2 dataset (30 items per subcategory) to demonstrate level ramp.
- New route `/translations` runs adaptive mode; `/translations/a1` remains available.


Step 3 — Error Review & Rewrite
--------------------------------
- Added error tracking service (LocalStorage) in `src/services/errorService.ts`.
- Errors are recorded automatically from TranslationExercise when user answers incorrectly.
- New pages:
  - `/errors` : list of saved errors.
  - `/errors/rewrite` : practice rewriting saved errors until corrected.
- On incorrect rewrite attempts, the error's counter is incremented and `updatedAt` refreshed.

Test:
1. Go to /translations or /translations/a1 and answer some items incorrectly.
2. Visit /errors to see saved mistakes.
3. Visit /errors/rewrite to practice and remove errors when correct.


Step 4 — Coniugazioni (Input Libero)
-----------------------------------
- Added conjugation engine (`src/data/conjugations.ts`) with functions to build conjugated forms for Present Simple, Past Simple, Present Continuous and Future Simple.
- `src/components/ConjugationExercise.tsx` allows user to pick pronoun and tense, then type the correct form.
- Answers are checked tolerant (case-insensitive, normalize diacritics, accept simple contractions like "I'm"/"I am").
- Wrong answers are recorded via `errorService.addOrUpdateError` for later review (Rewrite Errors).
- Route `/conjugations` added and Index quick-link included.

Testing:
1. Open /conjugations
2. Select pronoun and tense, then type correct and incorrect forms to verify behavior and error recording.


Step 5 — Supabase Auth + Progress
---------------------------------
- Added Supabase client placeholder (uses env VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).
- progressService now supports mock (LocalStorage) and Supabase upsert for progress.
- useProgress hook exposes addXP/addAchievement/setLevel/reset and persists accordingly.
- Auth page supports mock login (localStorage) and Supabase Auth when configured.

To enable real Supabase:
1. Create a Supabase project and set URL/Anon Key in .env.local
2. Run the SQL migration in supabase/migrations to create tables.
3. Set VITE_USE_MOCK=false and restart the app.

## Step 8 + Step 9 (Integrated, 2025-08-16)
- Deterministic GPT stub in `src/services/gptStub.ts`
- A2 datasets:
  - ENG↔ITA translations: `src/data/translationsA2.ts` (adjectives 40, verbs 50, nouns 60)
  - Phrasal verbs A2 (EN meanings): `src/data/phrasalVerbsA2.ts` (70+ entries)
  - Idioms A2: `src/data/idiomsA2.ts` (30 entries)
- Supabase schema migration: `supabase/migrations/20250816_init_schema.sql`
- `.env.local.example` with mock defaults
