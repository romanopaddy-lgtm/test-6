import React, { useMemo, useState } from 'react';
import { useLevel } from '@/contexts/LevelContext';
import { getIdioms } from '@/services/datasetLoader';

type IdiomItem = {
  idiom?: string;
  phrase?: string;
  meaning?: string;
  level?: string;
  [k: string]: any;
};

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildOptions(pool: IdiomItem[], correctIdx: number, count = 4) {
  const correct = pool[correctIdx];
  const others = pool.filter((_, i) => i !== correctIdx);
  const picks: IdiomItem[] = [];
  // pick up to count-1 distractors
  for (let i = 0; i < Math.min(count - 1, others.length); i++) {
    const r = Math.floor(Math.random() * others.length);
    picks.push(others.splice(r, 1)[0]);
  }
  const options = shuffle([correct, ...picks]);
  return options;
}

export default function Idioms(): JSX.Element {
  const { level } = useLevel();
  const pool = useMemo(() => (getIdioms(level) ?? []) as IdiomItem[], [level]);
  const [index, setIndex] = useState(0);
  const [reverse, setReverse] = useState(false); // forward: show idiom -> choose meaning. reverse: show meaning -> choose idiom
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState<boolean>(false);

  if (!Array.isArray(pool) || pool.length === 0) {
    return (
      <div style={{ padding: 12 }}>
        <h2>Idioms — livello: {level}</h2>
        <div style={{ padding: 16, background: '#fff7e6', borderRadius: 6 }}>
          Nessun esercizio disponibile per questo livello.
        </div>
      </div>
    );
  }

  const idx = index % pool.length;
  const item = pool[idx];
  const options = useMemo(() => buildOptions(pool, idx, 4), [pool, idx, index, reverse]);

  const correctKey = reverse ? (item.idiom || item.phrase || '') : (item.meaning || '');
  const correctOptionIndex = options.findIndex(o =>
    (reverse ? (o.idiom || o.phrase || '') : (o.meaning || '')) === correctKey
  );

  function onCheck() {
    setChecked(true);
  }

  function onNext() {
    setIndex(i => i + 1);
    setSelected(null);
    setChecked(false);
  }

  return (
    <div style={{ padding: 12 }}>
      <h2>Idioms — livello: {level}</h2>

      <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
        <label style={{ fontSize: 13, opacity: 0.8 }}>
          <input type="checkbox" checked={reverse} onChange={() => { setReverse(r => !r); setSelected(null); setChecked(false); }} />
          {' '}Reverse (show meaning → choose idiom)
        </label>
      </div>

      <div style={{ marginTop: 12, padding: 12, border: '1px solid #eee', borderRadius: 6, maxWidth: 900 }}>
        <div style={{ fontSize: 18, fontWeight: 600 }}>
          {reverse ? (item.meaning || '—') : (item.idiom || item.phrase || '—')}
        </div>

        <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
          {options.map((opt, i) => {
            const labelText = reverse ? (opt.idiom || opt.phrase || '—') : (opt.meaning || '—');
            const isSelected = selected === i;
            const isCorrect = checked && i === correctOptionIndex;
            const isWrongSelected = checked && isSelected && i !== correctOptionIndex;
            return (
              <label
                key={i}
                onClick={() => { if (!checked) setSelected(i); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: 10,
                  borderRadius: 6,
                  cursor: checked ? 'default' : 'pointer',
                  background: isCorrect ? '#e6ffed' : isWrongSelected ? '#ffecec' : '#fff',
                  border: isCorrect ? '1px solid #8ae39d' : isWrongSelected ? '1px solid #f5a6a6' : '1px solid #eee'
                }}
              >
                <input
                  type="radio"
                  name="idiom-opt"
                  checked={isSelected}
                  readOnly
                />
                <div style={{ fontSize: 15 }}>{labelText}</div>
              </label>
            );
          })}
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button onClick={onCheck} disabled={selected === null || checked}>Check</button>
          <button onClick={onNext}>Next</button>
          <div style={{ marginLeft: 'auto', fontSize: 13, opacity: 0.8 }}>
            {checked ? (
              correctOptionIndex === selected ? 'Corretto ✅' : `Sbagliato — risposta: ${reverse ? (options[correctOptionIndex].idiom || options[correctOptionIndex].phrase) : (options[correctOptionIndex].meaning)}`
            ) : `Item ${idx + 1} / ${pool.length}`}
          </div>
        </div>
      </div>
    </div>
  );
}