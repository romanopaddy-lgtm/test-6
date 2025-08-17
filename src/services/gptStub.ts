
/**
 * Improved deterministic GPT stub.
 * - Works when import.meta.env.VITE_BACKEND === 'mock' or VITE_USE_MOCK === 'true'
 * - Pure, seeded PRNG so same prompt → same output (good for tests)
 * - Exposes:
 *    - generateSynonyms(word, level)
 *    - rewriteSentence(input, opts)
 *    - suggestPhrasalVerbsForMeaning(meaning, level)
 *    - generateRewriteExerciseFromError(error)
 */

type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

const DEFAULT_LEVEL: Level = "A2";

// Simple xorshift32 PRNG
function makeRng(seedStr: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let state = h >>> 0;
  return () => {
    state ^= state << 13; state >>>= 0;
    state ^= state >> 17; state >>>= 0;
    state ^= state << 5;  state >>>= 0;
    return (state >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, arr: T[], n = 1): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(rng() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

// Minimal in-memory resources for mock generation
const SYNONYM_BANK: Record<Level, Record<string, string[]>> = {
  A1: {
    easy: ["simple","basic","clear","plain"],
    big: ["large","huge","massive","great"],
    small: ["little","tiny","mini","petite"],
  },
  A2: {
    easy: ["simple","straightforward","manageable","undemanding","uncomplicated"],
    important: ["crucial","significant","vital","key","essential"],
    difficult: ["hard","tough","challenging","demanding","arduous"],
    happy: ["glad","pleased","content","cheerful","joyful"],
    fast: ["quick","rapid","speedy","swift","brisk"]
  },
  B1: {},
  B2: {},
  C1: {},
  C2: {}
};

const PHRASAL_VERBS_A2: Array<{verb: string; meaning: string}> = [
  { verb: "look after", meaning: "to take care of someone or something" },
  { verb: "look for", meaning: "to try to find something" },
  { verb: "look forward to", meaning: "to feel excited about a future event" },
  { verb: "put off", meaning: "to postpone or delay" },
  { verb: "turn up", meaning: "to arrive or appear, often unexpectedly" },
  { verb: "turn down", meaning: "to refuse or reduce the volume" },
  { verb: "give up", meaning: "to stop doing something" },
  { verb: "give in", meaning: "to finally agree to something after resisting" },
  { verb: "get along (with)", meaning: "to have a good relationship" },
  { verb: "get over", meaning: "to recover from something" },
  { verb: "find out", meaning: "to discover or learn information" },
  { verb: "figure out", meaning: "to understand or solve something" },
  { verb: "carry on", meaning: "to continue" },
  { verb: "carry out", meaning: "to perform or complete a task" },
  { verb: "pick up", meaning: "to collect or learn informally" },
  { verb: "run into", meaning: "to meet by chance" },
  { verb: "run out (of)", meaning: "to have none left" },
  { verb: "set up", meaning: "to arrange or establish" },
  { verb: "bring up", meaning: "to mention a topic" },
  { verb: "work out", meaning: "to exercise or to find a solution" },
  { verb: "check in", meaning: "to register at a hotel or airport" },
  { verb: "check out", meaning: "to leave a hotel or to investigate" },
  { verb: "come across", meaning: "to find by chance" },
  { verb: "come up with", meaning: "to think of an idea or plan" },
  { verb: "drop off", meaning: "to deliver or to fall asleep" },
  { verb: "fill in", meaning: "to complete a form" },
  { verb: "get back", meaning: "to return" },
  { verb: "go on", meaning: "to continue" },
  { verb: "hang out", meaning: "to spend time relaxing" },
  { verb: "hold on", meaning: "to wait a moment" },
  { verb: "keep up (with)", meaning: "to continue at the same speed or level" },
  { verb: "make up", meaning: "to invent or to reconcile" },
  { verb: "point out", meaning: "to indicate or draw attention to" },
  { verb: "put on", meaning: "to dress oneself in something" },
  { verb: "put out", meaning: "to extinguish a fire or cigarette" },
  { verb: "set off", meaning: "to begin a journey; cause to operate" },
  { verb: "sort out", meaning: "to organize or resolve a problem" },
  { verb: "take off", meaning: "to remove or when a plane leaves the ground" },
  { verb: "take up", meaning: "to start a new hobby or activity" },
  { verb: "throw away", meaning: "to discard" },
  { verb: "try on", meaning: "to put on clothing to see if it fits" },
  { verb: "wake up", meaning: "to stop sleeping" },
  { verb: "back up", meaning: "to make a copy of data" },
  { verb: "break down", meaning: "to stop working (machine); become very upset" },
  { verb: "call off", meaning: "to cancel" },
  { verb: "catch up (with)", meaning: "to reach the same level" },
  { verb: "come up", meaning: "to be mentioned or to arise" },
  { verb: "cut down (on)", meaning: "to reduce the amount of something" },
  { verb: "drop by", meaning: "to visit briefly without appointment" },
  { verb: "end up", meaning: "to finally arrive at a place or situation" },
  { verb: "get around", meaning: "to travel or avoid something" },
  { verb: "give back", meaning: "to return something to its owner" },
  { verb: "go back", meaning: "to return to a place" },
  { verb: "grow up", meaning: "to become an adult" },
  { verb: "hang up", meaning: "to end a phone call" },
  { verb: "log in", meaning: "to sign into a computer system" },
  { verb: "pay back", meaning: "to return borrowed money" },
  { verb: "set aside", meaning: "to save for a purpose" },
  { verb: "show up", meaning: "to appear or arrive" },
  { verb: "speak up", meaning: "to talk louder" },
  { verb: "stand up", meaning: "to rise to a standing position" },
  { verb: "turn on", meaning: "to start a machine or light" },
  { verb: "turn off", meaning: "to stop a machine or light" },
  { verb: "write down", meaning: "to record in writing" }
];

export function isMockBackend() {
  return (
    (import.meta as any).env?.VITE_BACKEND === "mock" ||
    (import.meta as any).env?.VITE_USE_MOCK === "true"
  );
}

export async function generateSynonyms(word: string, level: Level = DEFAULT_LEVEL, seed?: string) {
  if (!isMockBackend()) throw new Error("generateSynonyms called in non-mock mode");
  const key = word.toLowerCase().trim();
  const bank = SYNONYM_BANK[level] || {};
  const inBank = bank[key];
  const rng = makeRng(seed ?? `${level}:${key}`);
  if (inBank && inBank.length) {
    const n = Math.min(5, inBank.length);
    return pick(rng, inBank, n);
  }
  // fallback: simple variations
  const suffixes = ["ish","-like","-type","-style","ish","plus"];
  const base = key.replace(/[^a-z]/g, "");
  const out = new Set<string>();
  while (out.size < 4) {
    const s = suffixes[Math.floor(rng() * suffixes.length)];
    out.add(`${base}${s}`.replace("--", "-"));
  }
  return Array.from(out);
}

export async function rewriteSentence(input: string, opts?: {useContractions?: boolean; targetLevel?: Level}) {
  if (!isMockBackend()) throw new Error("rewriteSentence called in non-mock mode");
  const text = input.trim();
  let out = text
    .replace(/\s+/g, " ")
    .replace(/\s([,.!?;:])/g, "$1");
  // Capitalize start
  out = out[0] ? out[0].toUpperCase() + out.slice(1) : out;
  if (opts?.useContractions !== false) {
    out = out
      .replace(/\bdo not\b/gi, "don't")
      .replace(/\bcan not\b/gi, "cannot")
      .replace(/\bwill not\b/gi, "won't")
      .replace(/\bis not\b/gi, "isn't")
      .replace(/\bare not\b/gi, "aren't")
      .replace(/\bhave not\b/gi, "haven't");
  }
  // Ensure period
  if (!/[.?!]$/.test(out)) out += ".";
  return out;
}

export async function suggestPhrasalVerbsForMeaning(meaning: string, level: Level = DEFAULT_LEVEL, seed?: string) {
  if (!isMockBackend()) throw new Error("suggestPhrasalVerbsForMeaning called in non-mock mode");
  const rng = makeRng(seed ?? `${level}:${meaning.toLowerCase().trim()}`);
  const n = 4;
  return pick(rng, PHRASAL_VERBS_A2, n);
}

export async function generateRewriteExerciseFromError(error: { prompt: string; userAnswer: string; correctAnswer: string }) {
  if (!isMockBackend()) throw new Error("generateRewriteExerciseFromError called in non-mock mode");
  const suggestion = await rewriteSentence(error.correctAnswer, { useContractions: true });
  const tip = "Focus on verb tense and word order. Re-read the sentence slowly.";
  return { suggestion, tip };
}
