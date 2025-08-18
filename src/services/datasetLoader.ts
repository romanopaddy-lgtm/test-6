// ...existing code...
import { PHRASAL_A2 } from '@/data/phrasalVerbsA2';
import * as PhrasalA1 from '@/data/phrasalVerbs';
import * as TransA2 from '@/data/translationsA2';
import * as TransA1 from '@/data/translationsA1';
import * as ConjA2 from '@/data/conjugationsA2';
import * as ConjA1 from '@/data/conjugations';
import * as IdiomsA2 from '@/data/idiomsA2';
import * as IdiomsA1 from '@/data/idioms';

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

const IDIOMS_A2 = pick<any[]>(IdiomsA2, 'IDIOMS_A2', 'default', 'IDIOMS') ?? [];
const IDIOMS_A1 = pick<any[]>(IdiomsA1, 'IDIOMS_A1', 'IDIOMS', 'default') ?? [];

export function getPhrasal(level: string) {
  try {
    if (!level || level === 'Adaptive') return PHRASAL_A1_LIST.length ? PHRASAL_A1_LIST : PHRASAL_A2;
    return String(level).toUpperCase() === 'A2' ? PHRASAL_A2 : PHRASAL_A1_LIST;
  } catch (err) {
    console.warn('getPhrasal fallback', err);
    return PHRASAL_A1_LIST.length ? PHRASAL_A1_LIST : PHRASAL_A2;
  }
}

export function getTranslations(level: string) {
  try {
    const isA2 = String(level).toUpperCase() === 'A2';
    return {
      adjectives: isA2 ? A2_ADJECTIVES : A1_ADJECTIVES,
      verbs: isA2 ? A2_VERBS : A1_VERBS,
      nouns: isA2 ? A2_NOUNS : A1_NOUNS
    };
  } catch (err) {
    console.warn('getTranslations fallback', err);
    return { adjectives: [], verbs: [], nouns: [] };
  }
}

export function getConjugations(level: string) {
  try {
    return String(level).toUpperCase() === 'A2' ? CONJ_A2_OBJ : CONJ_A1_OBJ;
  } catch (err) {
    console.warn('getConjugations fallback', err);
    return {};
  }
}

export function getIdioms(level: string) {
  try {
    return String(level).toUpperCase() === 'A2' ? IDIOMS_A2 : IDIOMS_A1;
  } catch (err) {
    console.warn('getIdioms fallback', err);
    return [];
  }
}
// ...existing code...