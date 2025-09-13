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

type CSVRow = Record<string, string>;

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

// helper: trova righe CSV per un prefisso (phrasal/idioms/translations/synonyms) e livello
function loadCsvRows(prefix: string, level: string) {
  const lvl = pickAdaptive(level);
  const lc = String(lvl || 'A1').toLowerCase();
  const keys = Object.keys(csvData || {});
  const candidates = [`${prefix}_${lc}`, `${prefix}${lc}`];
  const key = keys.find(k => candidates.includes(k) || candidates.includes(k.toLowerCase()));
  return key ? (csvData[key] || []) : [];
}

export function getPhrasal(level: string) {
  try {
    const rows = loadCsvRows('phrasal', level);
    if (rows && rows.length) return rows as any[];
    const lvl = pickAdaptive(level);
    return lvl === 'A2' ? PHRASAL_A2 : PHRASAL_A1_LIST;
  } catch (err) {
    console.warn('getPhrasal fallback', err);
    return PHRASAL_A1_LIST.length ? PHRASAL_A1_LIST : PHRASAL_A2;
  }
}

export function getIdioms(level: string) {
  try {
    const rows = loadCsvRows('idioms', level);
    if (rows && rows.length) return rows as any[];
    const lvl = pickAdaptive(level);
    return lvl === 'A2' ? IDIOMS_A2 : IDIOMS_A1;
  } catch (err) {
    console.warn('getIdioms fallback', err);
    return IDIOMS_A1;
  }
}

export function getTranslations(level: string) {
  try {
    const rows = loadCsvRows('translations', level);
    if (rows && rows.length) {
      const verbs: any[] = [];
      const nouns: any[] = [];
      const adjectives: any[] = [];

      const pick = (row: Record<string, any>, keys: string[]) => {
        for (const k of keys) {
          if (row[k] !== undefined && String(row[k] || '').trim().length) return String(row[k]).trim();
          // try lowercase/uppercase variants
          const kl = k.toLowerCase();
          for (const rk of Object.keys(row)) {
            if (rk.toLowerCase() === kl && String(row[rk] || '').trim().length) return String(row[rk]).trim();
          }
        }
        return '';
      };

      for (const r of rows) {
        // normalizza possibili header CSV per en/it/category/pos/type
        const en = pick(r, ['en', 'eng', 'english', 'english_text', 'word', 'text']);
        const it = pick(r, ['it', 'ita', 'italian', 'translation', 'italian_translation']);
        const typeRaw = pick(r, ['type', 'pos', 'category', 'role', 'Category']);
        const type = (typeRaw || '').toString().toLowerCase().trim();

        const obj = { ...(r || {}), en, it };

        if (type.includes('verb')) verbs.push(obj);
        else if (type.includes('noun')) nouns.push(obj);
        else if (type.includes('adj') || type.includes('adject')) adjectives.push(obj);
        else {
          // last-resort: if Category cell exists with plural like "adjectives"/"verbs"
          const catCell = pick(r, ['Category', 'category', 'Level']);
          const catLower = (catCell || '').toLowerCase();
          if (catLower.includes('adject')) adjectives.push(obj);
          else if (catLower.includes('verb')) verbs.push(obj);
          else if (catLower.includes('noun')) nouns.push(obj);
          else verbs.push(obj); // default to verbs
        }
      }

      return { adjectives, verbs, nouns };
    }

    // legacy behavior
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

export function getSynonyms(level: string) {
  try {
    const rows = loadCsvRows('synonyms', level);
    if (rows && rows.length) {
      const map: Record<string, string[]> = {};
      for (const r of rows) {
        const w = (r.word || r.lemma || r.base || '').toString().toLowerCase().trim();
        if (!w) continue;
        const raw = String(r.synonyms || r.values || r.syn || '');
        const syns = raw.split(/[;,]/).map(s => s.trim()).filter(Boolean);
        map[w] = syns;
      }
      return map;
    }
    return {};
  } catch (err) {
    console.warn('getSynonyms fallback', err);
    return {};
  }
}

// Import all CSVs eager (aggiornato: query '?raw' + import default)
const rawCsvModules = import.meta.glob('/src/data/csv/*.csv', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const csvData: Record<string, CSVRow[]> = {};
for (const [path, rawContent] of Object.entries(rawCsvModules)) {
  try {
    const name = path.split('/').pop()?.replace('.csv', '') ?? path;
    csvData[name.toLowerCase()] = parseCSV(String(rawContent));
  } catch {
    csvData[path.toLowerCase()] = [];
  }
}

// aggiungi questi helpers (se hai già glob per /src/data/csv/*.csv puoi riusarli)
// lightweight CSV parser used locally to avoid a missing import
function parseCSV(raw: string): Record<string, string>[] {
  if (!raw) return [];
  const normalize = (s: string) => s.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const text = normalize(raw).trim();
  if (!text) return [];

  function parseLine(line: string) {
    const cols: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        cols.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
    cols.push(cur);
    return cols;
  }

  const lines = text.split('\n').filter(l => l.trim().length > 0);
  const headers = parseLine(lines[0]).map(h => h.trim());
  const out: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseLine(lines[i]);
    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = (cols[j] ?? '').trim();
    }
    out.push(row);
  }
  return out;
}

async function loadCSVByName(name: string) {
  const key = Object.keys(rawCsvModules).find(k => k.endsWith(`/${name}.csv`));
  if (!key) return [];
  const raw = rawCsvModules[key];
  return parseCSV(String(raw));
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

try {
  // espone i dati CSV e la funzione di accesso nel global scope per debug runtime
  (globalThis as any).__csvData = csvData;
  (globalThis as any).__getConjugations = (lvl: string) => {
    try { return getConjugationsRaw(lvl); } catch (e) { console.warn(e); return {}; }
  };
  console.debug && console.debug('[datasetLoader:DEBUG] csv keys ->', Object.keys(csvData || {}));
} catch (e) {
  // non bloccare l'app se globalThis non è scrivibile
  void e;
}