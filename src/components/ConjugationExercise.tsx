import React, { useEffect, useMemo, useState } from 'react';
import { useLevel } from '@/contexts/LevelContext';

function normalize(s?: string) { return (s || '').toLowerCase().replace(/\s+/g, ' ').trim(); }

// basic irregulars for A2 past simple / present 3rd person special cases
const IRREGULAR_PAST: Record<string,string> = {
  be: 'was',
  am: 'was',
  are: 'were',
  is: 'was',
  have: 'had',
  do: 'did',
  go: 'went',
  get: 'got',
  give: 'gave',
  take: 'took',
  make: 'made',
  say: 'said',
  come: 'came',
  see: 'saw',
  think: 'thought',
  leave: 'left',
  begin: 'began',
  bring: 'brought',
  buy: 'bought',
  sell: 'sold',
  pay: 'paid',
  send: 'sent',
  sit: 'sat',
  stand: 'stood',
  run: 'ran',
  ride: 'rode',
  drive: 'drove',
  swim: 'swam',
  fly: 'flew',
  sleep: 'slept',
  read: 'read',
  write: 'wrote',
  draw: 'drew',
  eat: 'ate',
  drink: 'drank',
  cut: 'cut',
  put: 'put',
  teach: 'taught',
  learn: 'learned',
  study: 'studied',
  watch: 'watched',
  listen: 'listened',
  open: 'opened',
  close: 'closed',
  live: 'lived',
  work: 'worked'
};

const A1_VERBS = [
  'be','have','do','go','play','like','love','make','eat','drink','read','write','speak','say','listen','hear','see','look','watch','come','take','give','get','put','open','close','live','work','study','learn','know','want','need','can','will','help','use','run','walk','sleep'
];

const A2_VERBS = [
  'be','have','do','go','get','give','take','make','say','tell','speak','know','think','understand','find','feel','leave','meet','come','become','begin','bring','buy','sell','pay','send','sit','stand','run','ride','drive','swim','fly','sleep','read','write','draw','eat','drink','cut','put','teach','learn','study','watch','listen','open','close','live','work'
];

const PERSONS = [
  { code: '1s', label: 'I', subject: 'I' },
  { code: '2s', label: 'you (sing)', subject: 'you' },
  { code: '3s', label: 'he/she/it', subject: 'he/she/it' },
  { code: '1p', label: 'we', subject: 'we' },
  { code: '2p', label: 'you (pl)', subject: 'you' },
  { code: '3p', label: 'they', subject: 'they' },
];

export default function ConjugationExercise(): JSX.Element {
  const { level } = useLevel();
  const adaptive = level === 'Adaptive';

  const pool = useMemo(() => {
    return (adaptive || level === 'A2') ? A2_VERBS.slice() : A1_VERBS.slice();
  }, [level, adaptive]);

  const [index, setIndex] = useState(0);
  const [task, setTask] = useState<{ verb: string; tense: 'present_simple'|'past_simple'; person: typeof PERSONS[number]; expected: string } | null>(null);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<'correct'|'wrong'|null>(null);

  useEffect(() => {
    // generate a new task whenever index or level changes
    const verb = pool[index % pool.length];
    // pick tense depending on level
    const allowed = (adaptive || level === 'A2') ? ['present_simple','past_simple'] : ['present_simple'];
    const tense = allowed[Math.floor(Math.random() * allowed.length)] as ('present_simple'|'past_simple');
    const person = PERSONS[Math.floor(Math.random() * PERSONS.length)];
    const expected = computeExpected(verb, tense, person.code);
    setTask({ verb, tense, person, expected });
    setInput('');
    setChecked(false);
    setResult(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, level]);

  function computeExpected(verb: string, tense: string, personCode: string) {
    verb = String(verb || '').toLowerCase();
    if (tense === 'present_simple') {
      if (personCode === '3s') {
        // special verbs
        if (verb === 'be') return 'is';
        if (verb === 'have') return 'has';
        // verbs that end with ch/sh/s/x/o -> add 'es'
        if (/[sxz]$/.test(verb) || /(?:ch|sh|o)$/.test(verb)) return verb + 'es';
        // verbs ending with consonant + y -> replace y with ies
        if (/[a-z]y$/.test(verb) && !/[aeiou]y$/.test(verb)) return verb.replace(/y$/, 'ies');
        return verb + 's';
      } else {
        // other persons
        if (verb === 'be') {
          if (personCode === '1s') return 'am';
          return 'are';
        }
        return verb;
      }
    } else { // past_simple
      // look up irregulars
      if (IRREGULAR_PAST[verb]) return IRREGULAR_PAST[verb];
      // regular
      if (verb.endsWith('e')) return verb + 'd';
      if (verb.endsWith('y') && !/[aeiou]y$/.test(verb)) return verb.replace(/y$/, 'ied');
      return verb + 'ed';
    }
  }

  function onCheck() {
    if (!task) return;
    const ok = normalize(input) === normalize(task.expected);
    setChecked(true);
    setResult(ok ? 'correct' : 'wrong');
  }

  function onNext() {
    setIndex(i => i + 1);
  }

  if (!task) return <div style={{ padding: 12 }}>Caricamento...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 12 }}>
      <div style={{ fontSize: 13, opacity: 0.8 }}>Conjugation — livello: {level}</div>

      <div style={{ marginTop: 12, padding: 12, border: '1px solid #eee', borderRadius: 6 }}>
        <div style={{ fontSize: 18, fontWeight: 600 }}>{task.person.label} — {task.tense.replace('_',' ')} — {task.verb}</div>

        <div style={{ marginTop: 12 }}>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Inserisci la forma corretta" style={{ width: '100%', padding: 8 }} disabled={checked} />
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button onClick={onCheck} disabled={checked || input.trim() === ''}>Check</button>
          <button onClick={onNext}>Next</button>
          <div style={{ marginLeft: 'auto', fontSize: 13, opacity: 0.8 }}>
            {checked ? (result === 'correct' ? 'Corretto ✅' : `Sbagliato — risposta: ${task.expected}`) : `Item ${index % pool.length + 1} / ${pool.length}`}
          </div>
        </div>
      </div>
    </div>
  );
}