import { PHRASAL_A2 } from '@/data/phrasalVerbsA2';
import * as PhrasalA1 from '@/data/phrasalVerbs';
import * as TransA2 from '@/data/translationsA2';
import * as TransA1 from '@/data/translationsA1';
import * as ConjA2 from '@/data/conjugationsA2';
import * as ConjA1 from '@/data/conjugations';

/**
 * Robust fallback for different module export shapes
 */
function pick<T = any>(module: any, ...candidates: string[]): T {
  if (!module) return undefined as unknown as T;
  for (const k of candidates) {
    try {
      if (k === 'default' && module.default !== undefined) return module.default as T;
      if (k in module) return module[k] as T;
    } catch { /* ignore */ }
  }
  return undefined as unknown as T;
}

const PHRASAL_A1_LIST: any[] = pick<any[]>(PhrasalA1, 'PHRASAL_A1', 'PHRASAL', 'default') ?? [];
const A1_ADJECTIVES = pick<any[]>(TransA1, 'A1_ADJECTIVES', 'ADJECTIVES', 'default') ?? [];
const A1_VERBS = pick<any[]>(TransA1, 'A1_VERBS', 'VERBS', 'default') ?? [];
const A1_NOUNS = pick<any[]>(TransA1, 'A1_NOUNS', 'NOUNS', 'default') ?? [];

const A2_ADJECTIVES = pick<any[]>(TransA2, 'A2_ADJECTIVES', 'ADJECTIVES', 'default') ?? [];
const A2_VERBS = pick<any[]>(TransA2, 'A2_VERBS', 'VERBS', 'default') ?? [];
const A2_NOUNS = pick<any[]>(TransA2, 'A2_NOUNS', 'NOUNS', 'default') ?? [];

const CONJ_A2_OBJ = pick<any>(ConjA2, 'CONJ_A2', 'CONJ', 'default') ?? {};
const CONJ_A1_OBJ = pick<any>(ConjA1, 'CONJ', 'default') ?? {};

export function getPhrasal(level: string) {
  if (!level || level === 'Adaptive') return PHRASAL_A1_LIST.length ? PHRASAL_A1_LIST : PHRASAL_A2;
  return level === 'A2' ? PHRASAL_A2 : PHRASAL_A1_LIST;
}

export function getTranslations(level: string) {
  return {
    adjectives: level === 'A2' ? A2_ADJECTIVES : A1_ADJECTIVES,
    verbs: level === 'A2' ? A2_VERBS : A1_VERBS,
    nouns: level === 'A2' ? A2_NOUNS : A1_NOUNS
  };
}

export function getConjugations(level: string) {
  return level === 'A2' ? CONJ_A2_OBJ : CONJ_A1_OBJ;
}