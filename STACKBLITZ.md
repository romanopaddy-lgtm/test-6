# StackBlitz Launch & QA — Step 10 (Final)
Date: 2025-08-16T11:39:20.205895Z

## Launch
1. Create React (Vite) project on StackBlitz.
2. Drag & drop this ZIP over the file tree (overwrite).
3. Terminal:
   ```bash
   npm install
   npm run dev
   ```
4. Ensure env mock: `VITE_BACKEND=mock`, `VITE_USE_MOCK=true`.

## QA checklist
- Translations A1/A2 routes render; ENG↔ITA only for allowed categories.
- Phrasal/Idioms use EN meanings only; multi-select works and scores partial.
- Synonyms exercise returns deterministic results for same inputs.
- Rewrite Errors view replays mistakes and shows suggestions + tip.
- TTS button pronounces UK English and can be stopped/replayed.
- Progress (XP/streak) increments across exercise submits.
- Error Review queue persists between reloads via LocalStorage.
- No missing-module errors in console.
- Schema SQL applied successfully when switching to Supabase.

## Data
- CSVs for Supabase import under `data/csv/`.
