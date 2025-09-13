import { currentUser } from '@/services/authService';

export interface ErrorRecord {
  id: string;
  userId?: string;
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

const GLOBAL_KEY = 'panda.errors.v1';

function keyForUser(): string {
  const u = currentUser();
  const key = u && u.id ? `${GLOBAL_KEY}.${u.id}` : `${GLOBAL_KEY}.anon`;
  // debug
  console.debug('[errorService] keyForUser ->', key, 'currentUser:', u && { id: u.id, username: u.username });
  return key;
}

function loadRaw(key: string): ErrorRecord[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      console.debug('[errorService] loadRaw: no data for key', key);
      return [];
    }
    const parsed = JSON.parse(raw) as ErrorRecord[];
    console.debug('[errorService] loadRaw:', key, 'items:', parsed.length);
    return parsed;
  } catch (err) {
    console.error('[errorService] loadRaw: parse error for key', key, err);
    return [];
  }
}

function saveRaw(key: string, items: ErrorRecord[]) {
  try {
    localStorage.setItem(key, JSON.stringify(items));
    console.debug('[errorService] saveRaw:', key, 'itemsSaved:', items.length);
  } catch (err) {
    console.error('[errorService] saveRaw error', err);
  }
}

// migrate global -> per-user on first access (keeps global if not logged)
function migrateGlobalToUserIfNeeded() {
  const u = currentUser();
  if (!u || !u.id) {
    // no user: nothing to migrate
    return;
  }
  const userKey = keyForUser();
  const existingUserItems = loadRaw(userKey);
  if (existingUserItems.length > 0) {
    console.debug('[errorService] migrate: user already has items, skipping');
    return; // already populated
  }
  const globalItems = loadRaw(GLOBAL_KEY);
  if (!globalItems || globalItems.length === 0) {
    console.debug('[errorService] migrate: no global items to migrate');
    return;
  }
  // move all global items to user (attach userId)
  const moved = globalItems.map(it => ({ ...it, userId: u.id }));
  saveRaw(userKey, moved);
  console.debug('[errorService] migrate: moved', moved.length, 'items to', userKey);
  // remove global to avoid duplicate migration later
  try { localStorage.removeItem(GLOBAL_KEY); console.debug('[errorService] migrate: removed global key', GLOBAL_KEY); } catch (e){ console.error(e); }
}

function load(): ErrorRecord[] {
  migrateGlobalToUserIfNeeded();
  const items = loadRaw(keyForUser());
  return items;
}

function save(items: ErrorRecord[]) {
  saveRaw(keyForUser(), items);
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
  console.debug('[errorService] addOrUpdateError called', payload);
  const items = load();
  const idx = items.findIndex(i => i.type === payload.type && i.prompt === payload.prompt && i.userAnswer === payload.userAnswer);
  const now = Date.now();
  const u = currentUser();
  if (idx >= 0) {
    const rec = items[idx];
    rec.count = (rec.count||0) + 1;
    rec.updatedAt = now;
    rec.lastAttemptAt = now;
    if (payload.expected) rec.expected = payload.expected;
    items[idx] = rec;
    console.debug('[errorService] addOrUpdateError: updated existing record', rec.id);
  } else {
    const rec: ErrorRecord = {
      id: 'err_' + Math.random().toString(36).slice(2,9),
      userId: u?.id,
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
    console.debug('[errorService] addOrUpdateError: created new record', rec.id, 'userId:', rec.userId);
  }
  save(items);
  return true;
}

export function incrementError(id: string){
  console.debug('[errorService] incrementError', id);
  const items = load();
  const idx = items.findIndex(i => i.id === id);
  if (idx >= 0){
    items[idx].count = (items[idx].count || 0) + 1;
    items[idx].updatedAt = Date.now();
    items[idx].lastAttemptAt = Date.now();
    save(items);
    console.debug('[errorService] incrementError: new count', items[idx].count);
    return items[idx];
  }
  console.warn('[errorService] incrementError: id not found', id);
  return null;
}

export function markCorrected(id: string){
  console.debug('[errorService] markCorrected', id);
  const items = load();
  const idx = items.findIndex(i => i.id === id);
  if (idx >= 0){
    items.splice(idx,1);
    save(items);
    console.debug('[errorService] markCorrected: removed', id);
    return true;
  }
  console.warn('[errorService] markCorrected: id not found', id);
  return false;
}

export function clearAllErrors(){
  save([]);
  console.debug('[errorService] clearAllErrors');
}
