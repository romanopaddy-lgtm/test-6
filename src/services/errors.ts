import { getErrors as getErrorRecords, addOrUpdateError, markCorrected, incrementError as incError } from './errorService';

export type LoggedError = {
  id: string;
  type: 'translation'|'phrasal'|'idiom'|'synonym'|'verb'|'adjective'|'general'|'conjugation'|'rewrite';
  payload: any;
  lastAttempt: number;
  attempts: number;
  resolved: boolean;
}

/**
 * Restituisce gli errori nel formato usato in altre parti del codice.
 */
export function listErrors(): LoggedError[] {
  const records = getErrorRecords();
  return records.map(r => ({
    id: r.id,
    type: (r.type as LoggedError['type']) || 'general',
    payload: { prompt: r.prompt, expected: r.expected, userAnswer: r.userAnswer, level: r.level },
    lastAttempt: r.lastAttemptAt || r.updatedAt || r.createdAt || Date.now(),
    attempts: r.count || 0,
    resolved: false
  }));
}

/**
 * Compat: converte il payload e chiama addOrUpdateError
 */
export function logError(e: Omit<LoggedError, 'id'|'lastAttempt'|'attempts'|'resolved'>){
  const prompt =
    typeof e.payload === 'string'
      ? e.payload
      : (e.payload && (e.payload.prompt || e.payload.text || e.payload.promptText)) || JSON.stringify(e.payload || {});
  addOrUpdateError({ type: e.type as string || 'general', prompt, expected: undefined, userAnswer: undefined });
}

/**
 * Risolve (delegato)
 */
export function resolveError(id: string){
  return markCorrected(id);
}

/**
 * Incrementa contatore (delegato)
 */
export function incrementError(id: string){
  return incError(id);
}
