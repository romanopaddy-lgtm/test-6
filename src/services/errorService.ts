// Error service (mock) - stores mistakes in LocalStorage and provides helpers for Rewrite mode.
export interface ErrorRecord {
  id: string;
  type: string; // e.g., 'translation', 'verb', 'phrasal'
  level?: string;
  prompt: string; // the exercise prompt
  expected?: string; // expected correct answer(s)
  userAnswer?: string; // last wrong answer
  count: number; // number of times failed
  createdAt: number;
  updatedAt: number;
  lastAttemptAt?: number;
}

const KEY = 'panda.errors.v1';

function load(): ErrorRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ErrorRecord[];
  } catch { return []; }
}

function save(items: ErrorRecord[]) {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
}

export function getErrors(): ErrorRecord[] {
  const items = load();
  // sort by updatedAt desc
  return items.sort((a,b)=> b.updatedAt - a.updatedAt);
}

export function findErrorIndex(match: { type?: string; prompt?: string; userAnswer?: string }){
  const items = load();
  return items.findIndex(i => 
    (match.type ? i.type === match.type : true) &&
    (match.prompt ? i.prompt === match.prompt : true) &&
    (match.userAnswer ? i.userAnswer === match.userAnswer : true)
  );
}

export function addOrUpdateError(payload: { type: string; level?: string; prompt: string; expected?: string; userAnswer?: string }){
  const items = load();
  const idx = items.findIndex(i => i.type === payload.type && i.prompt === payload.prompt && i.userAnswer === payload.userAnswer);
  const now = Date.now();
  if (idx >= 0) {
    const rec = items[idx];
    rec.count = (rec.count||0) + 1;
    rec.updatedAt = now;
    rec.lastAttemptAt = now;
    if (payload.expected) rec.expected = payload.expected;
    items[idx] = rec;
  } else {
    const rec: ErrorRecord = {
      id: 'err_' + Math.random().toString(36).slice(2,9),
      type: payload.type,
      level: payload.level,
      prompt: payload.prompt,
      expected: payload.expected,
      userAnswer: payload.userAnswer,
      count: 1,
      createdAt: now,
      updatedAt: now,
      lastAttemptAt: now
    };
    items.push(rec);
  }
  save(items);
  return true;
}

export function incrementError(id: string){
  const items = load();
  const idx = items.findIndex(i => i.id === id);
  if (idx >= 0){
    items[idx].count = (items[idx].count || 0) + 1;
    items[idx].updatedAt = Date.now();
    items[idx].lastAttemptAt = Date.now();
    save(items);
    return items[idx];
  }
  return null;
}

export function markCorrected(id: string){
  const items = load();
  const idx = items.findIndex(i => i.id === id);
  if (idx >= 0){
    items.splice(idx,1);
    save(items);
    return true;
  }
  return false;
}

export function clearAllErrors(){
  save([]);
}
