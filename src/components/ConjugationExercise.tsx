import React, { useEffect, useMemo, useState } from 'react';
import { useLevel } from '@/contexts/LevelContext';
import { getConjugationsRaw } from '@/services/datasetLoader';
import { addOrUpdateError } from '@/services/errorService';

type Person = { code: string; label: string };

// PERSONS: codice corrisponde alle colonne nei CSV (1s,2s,3s,1p,2p,3p)
const PERSONS: Person[] = [
  { code: '1s', label: 'I' },
  { code: '2s', label: 'You' },
  { code: '3s', label: 'He/She/It' },
  { code: '1p', label: 'We' },
  { code: '2p', label: 'You (pl)' },
  { code: '3p', label: 'They' }
];

// Minimal legacy pools (preservano il fallback); puoi sostituirli con le liste complete esistenti
const A1_VERBS = ['be', 'have', 'do', 'go', 'get', 'make', 'say', 'take', 'come', 'see', 'know'];
const A2_VERBS = [...A1_VERBS, 'think', 'find', 'give', 'work', 'play', 'look', 'call', 'try', 'ask'];

function normalize(s?: string) {
  return (s || '').toString().trim().toLowerCase().replace(/\s+/g, ' ');
}

function computeExpectedLegacy(verb: string, tense: string, personCode: string) {
  // comportamento legacy minimale: solo per fallback (non dettagliato)
  // qui manteniamo qualche regola base per present/past simple
  if (tense === 'present_simple') {
    if (personCode === '3s') {
      if (verb.endsWith('y') && !/[aeiou]y$/.test(verb)) return verb.slice(0, -1) + 'ies';
      if (verb.endsWith('s') || verb.endsWith('sh') || verb.endsWith('ch') || verb.endsWith('x') || verb.endsWith('z')) return verb + 'es';
      return verb + 's';
    }
    return verb;
  }
  if (tense === 'past_simple') {
    // very naive past
    if (verb === 'be') return personCode === '1s' || personCode === '3s' ? 'was' : 'were';
    if (verb.endsWith('e')) return verb + 'd';
    if (verb.endsWith('y') && !/[aeiou]y$/.test(verb)) return verb.slice(0, -1) + 'ied';
    return verb + 'ed';
  }
  // future_simple
  if (tense === 'future_simple') return 'will ' + verb;
  // default
  return verb;
}

export default function ConjugationExercise(): JSX.Element {
  const { level } = useLevel();
  const adaptive = String(level || '').toUpperCase() === 'ADAPTIVE';

  // 1) carica i dati CSV in modo asincrono; fallback a getConjugations() (sync) se necessario
  const [conjMap, setConjMap] = useState<Record<string, Record<string, Record<string, string>>>>({});
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await getConjugationsRaw(level);
        if (!mounted) return;
        if (raw && Object.keys(raw).length) {
          setConjMap(raw as any);
          return;
        }
        // no CSV data available — set empty map as fallback
        if (mounted) setConjMap({});
      } catch {
        if (mounted) setConjMap({});
      }
    })();
    return () => { mounted = false; };
  }, [level]);

  // CSV rows: una entry per (verb, tense) — corrisponde alle righe nel file CSV
  const csvRows = useMemo(() => {
    const rows: { verb: string; tense: string }[] = [];
    for (const verb of Object.keys(conjMap || {})) {
      const tenses = Object.keys(conjMap[verb] || {});
      for (const tense of tenses) rows.push({ verb, tense });
    }
    return rows;
  }, [conjMap]);

  // state per task
  const [index, setIndex] = useState(0);
  const [task, setTask] = useState<{
    verb: string;
    tense: string;
    person: Person;
    expected: string;
    fromCSV?: boolean;
  } | null>(null);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<null | 'correct' | 'wrong'>(null);

  function pickRandom<T>(arr: T[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function nextTaskFromCSV(i: number) {
    if (!csvRows.length) return null;
    const row = csvRows[i % csvRows.length];
    const forms = conjMap[row.verb]?.[row.tense] || {};
    // scegli fra le persone che hanno una forma non vuota in questa riga
    const avail = PERSONS.filter(p => String(forms[p.code] || '').trim().length > 0);
    if (!avail.length) return null;
    const person = avail[Math.floor(Math.random() * avail.length)];
    const expected = String(forms[person.code] || '').trim();
    if (!expected) return null;
    return { verb: row.verb, tense: row.tense, person, expected, fromCSV: true };
  }

  // genera nuovo task al change di index/level
  useEffect(() => {
    // prova CSV prima
    const csvTask = nextTaskFromCSV(index);
    if (csvTask) {
      setTask(csvTask);
      setInput('');
      setChecked(false);
      setResult(null);
      return;
    }

    // fallback legacy pool
    const pool = (adaptive || String(level).toUpperCase() === 'A2') ? A2_VERBS.slice() : A1_VERBS.slice();
    if (!pool.length) {
      setTask(null);
      return;
    }
    const verb = pool[index % pool.length];
    const allowed = (adaptive || String(level).toUpperCase() === 'A2') ? ['present_simple', 'past_simple'] : ['present_simple'];
    const tense = pickRandom(allowed);
    const person = pickRandom(PERSONS);
    const expected = computeExpectedLegacy(verb, tense, person.code);
    setTask({ verb, tense, person, expected, fromCSV: false });
    setInput('');
    setChecked(false);
    setResult(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, level, conjMap]);

  function check() {
    if (!task) return;
    setChecked(true);
    const expectedNorm = normalize(task.expected);
    const gotNorm = normalize(input);
    const isCorrect = expectedNorm === gotNorm;
    setResult(isCorrect ? 'correct' : 'wrong');
    if (!isCorrect) {
      try {
        addOrUpdateError({
          type: 'conjugation',
          level,
          prompt: `${task.person.label} ${task.tense} ${task.verb}`,
          expected: task.expected,
            userAnswer: input
        });
        console.debug('[ConjugationExercise] addOrUpdateError called', {
          prompt: `${task.person.label} ${task.tense} ${task.verb}`,
          expected: task.expected,
          userAnswer: input
        });
      } catch (err) {
        console.error('[ConjugationExercise] addOrUpdateError failed', err);
      }
    }
  }

  function next() {
    setIndex(i => i + 1);
  }

  // UI minimale per debug / uso reale
  return (
    <div style={{ padding: 12, maxWidth: 760 }}>
      <h3>Conjugations — level: {String(level || '').toUpperCase()}</h3>
      <div style={{ marginBottom: 8 }}>
        <small>Verbs available: {csvRows.length || (adaptive || level === 'A2' ? A2_VERBS.length : A1_VERBS.length)}</small>
      </div>

      {!task && (
        <div>
          <div>No task available for this level.</div>
          <button onClick={() => setIndex(i => i + 1)} style={{ marginTop: 8 }}>Try next</button>
        </div>
      )}

      {task && (
        <div>
          <div style={{ marginBottom: 12 }}>
            <strong>{task.person.label}</strong> — <em>{task.tense}</em> — <span style={{ textTransform: 'capitalize' }}>{task.verb}</span>
            <div style={{ fontSize: 12, color: '#666' }}>{task.fromCSV ? 'source: CSV' : 'source: legacy'}</div>
          </div>

          <div>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type the correct form"
              style={{ width: '100%', padding: 8, fontSize: 16 }}
              onKeyDown={e => { if (e.key === 'Enter') check(); }}
            />
          </div>

          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            {!checked && (
              <button onClick={check} disabled={!input.trim()}>Check</button>
            )}
            {checked && (
              <>
                <button onClick={next}>Next</button>
                {result === 'correct' && <span style={{ color: 'green' }}>Correct!</span>}
                {result === 'wrong' && (
                  <span style={{ color: 'red' }}>
                    Expected: {task.expected}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}