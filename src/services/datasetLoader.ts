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

function pickAdaptive(level: string) {
  if (!level) return 'A1';
  if (String(level).toUpperCase() !== 'ADAPTIVE') return String(level).toUpperCase();
  // adaptive: randomly A1 or A2 for now
  return Math.random() < 0.5 ? 'A1' : 'A2';
}

export function getPhrasal(level: string) {
  try {
    const lvl = pickAdaptive(level);
    if (lvl === 'A2') return PHRASAL_A2;
    return PHRASAL_A1_LIST;
  } catch (err) {
    console.warn('getPhrasal fallback', err);
    return PHRASAL_A1_LIST.length ? PHRASAL_A1_LIST : PHRASAL_A2;
  }
}

export function getTranslations(level: string) {
  try {
    const lvl = pickAdaptive(level);
    const isA2 = lvl === 'A2';
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
    const lvl = pickAdaptive(level);
    return lvl === 'A2' ? CONJ_A2_OBJ : CONJ_A1_OBJ;
  } catch (err) {
    console.warn('getConjugations fallback', err);
    return {};
  }
}

export function getIdioms(level: string) {
  try {
    const lvl = pickAdaptive(level);
    return lvl === 'A2' ? IDIOMS_A2 : IDIOMS_A1;
  } catch (err) {
    console.warn('getIdioms fallback', err);
    return [];
  }
}

// aggiungi questi helpers (se hai già glob per /src/data/csv/*.csv puoi riusarli)
async function loadCSVByName(name: string) {
  const key = Object.keys(csvModules).find(k => k.endsWith(`/${name}.csv`));
  if (!key) return [];
  const loader = csvModules[key] as () => Promise<string>;
  const raw = await loader();
  return parseCSV(raw);
}

export async function getSynonymsRaw(level: string) {
  const lvl = (String(level || 'A1').toUpperCase() === 'ADAPTIVE') ? 'A1' : String(level || 'A1').toUpperCase();
  const rows = await loadCSVByName(`synonyms_${lvl}`);
  // rows: { level, word, synonyms } with synonyms separated by semicolon
  const map: Record<string,string[]> = {};
  for (const r of rows) {
    const w = (r.word || '').toLowerCase().trim();
    if (!w) continue;
    const syns = String(r.synonyms || '').split(';').map(s=>s.trim()).filter(Boolean);
    map[w] = syns;
  }
  return map;
}

export async function getConjugationsRaw(level: string) {
  const lvl = (String(level || 'A1').toUpperCase() === 'ADAPTIVE') ? 'A1' : String(level || 'A1').toUpperCase();
  const rows = await loadCSVByName(`conjugations_${lvl}`);
  // if table-format: rows have columns 1s..3p, return structured object
  if (rows.length && rows[0]['1s'] !== undefined) {
    const out: Record<string, any> = {};
    for (const r of rows) {
      const verb = r.verb;
      const tense = r.tense;
      out[verb] = out[verb] || {};
      out[verb][tense] = {
        '1s': r['1s'], '2s': r['2s'], '3s': r['3s'], '1p': r['1p'], '2p': r['2p'], '3p': r['3p']
      };
    }
    return out;
  }
  // fallback long-format parsing (if needed)
  const out2: Record<string, any> = {};
  for (const r of rows) {
    const verb = r.verb;
    out2[verb] = out2[verb] || {};
    out2[verb][r.tense] = out2[verb][r.tense] || {};
    out2[verb][r.tense][r.person] = r.form;
  }
  return out2;
}