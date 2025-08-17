import { storage } from '@/lib/storage';

export type LoggedError = {
  id: string;
  type: 'translation'|'phrasal'|'idiom'|'synonym'|'verb'|'adjective'|'general'|'conjugation'|'rewrite';
  payload: any;
  lastAttempt: number;
  attempts: number;
  resolved: boolean;
}

const KEY = 'errors';

export function listErrors(): LoggedError[]{
  return storage.get<LoggedError[]>(KEY, []);
}

export function logError(e: Omit<LoggedError, 'id'|'lastAttempt'|'attempts'|'resolved'>){
  const all = listErrors();
  all.push({ id: crypto.randomUUID(), lastAttempt: Date.now(), attempts: 1, resolved: false, ...e });
  storage.set(KEY, all);
}

export function resolveError(id: string){
  const all = listErrors();
  const idx = all.findIndex(x => x.id === id);
  if (idx >= 0){ all[idx].resolved = true; all[idx].lastAttempt = Date.now(); }
  storage.set(KEY, all);
}
