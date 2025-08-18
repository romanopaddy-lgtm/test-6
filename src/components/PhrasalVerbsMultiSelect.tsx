// ...existing code...
import React, { useMemo, useState } from 'react';
import { useLevel } from '@/contexts/LevelContext';
import { getPhrasal } from '@/services/datasetLoader';

type PhrasalItem = {
  verb: string;
  meaning?: string;
  level?: string;
  [k: string]: any;
};

/** shuffle array and return new array */
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** pick random element */
function choice<T>(arr: T[]): T | undefined {
  if (!arr || arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Simple evaluator for a multi-select phrasal exercise:
 * selectedIndices -> returns number of correct selections vs pool.
 */
export function evaluatePhrasalMultiSelect(selectedIndices: number[], pool: PhrasalItem[], correctPredicate: (item: PhrasalItem)=>boolean): { correct: number; totalCorrect: number } {
  const selectedSet = new Set(selectedIndices);
  let correct = 0;
  let totalCorrect = 0;
  pool.forEach((item, idx) => {
    const isCorrect = !!correctPredicate(item);
    if (isCorrect) totalCorrect++;
    if (isCorrect && selectedSet.has(idx)) correct++;
  });
  return { correct, totalCorrect };
}

export default function PhrasalVerbsMultiSelect(): JSX.Element {
  const { level } = useLevel();
  const pool: PhrasalItem[] = useMemo(() => {
    const items = getPhrasal(level) ?? [];
    return shuffle(items as PhrasalItem[]);
  }, [level]);

  const [selected, setSelected] = useState<Record<number, boolean>>({});

  function toggle(i: number) {
    setSelected(s => ({ ...s, [i]: !s[i] }));
  }

  function clearSelection() {
    setSelected({});
  }

  function buildAnswerPreview(): string[] {
    return Object.keys(selected)
      .filter(k => selected[Number(k)])
      .map(k => {
        const idx = Number(k);
        return pool[idx] ? `${pool[idx].verb}${pool[idx].meaning ? ' — ' + pool[idx].meaning : ''}` : `#${k}`;
      });
  }

  return (
    <div style={{maxWidth:900,margin:'0 auto',padding:12}}>
      <h3 style={{marginBottom:8}}>Phrasal verbs — livello: {level}</h3>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:8}}>
        {pool.map((p, i) => (
          <label key={i} style={{display:'flex',alignItems:'center',gap:8,padding:12,border:'1px solid #eee',borderRadius:6}}>
            <input
              type="checkbox"
              checked={!!selected[i]}
              onChange={() => toggle(i)}
              aria-label={`Select ${p.verb}`}
            />
            <div>
              <div style={{fontWeight:600}}>{p.verb}</div>
              {p.meaning && <div style={{fontSize:13,opacity:0.7}}>{p.meaning}</div>}
            </div>
          </label>
        ))}
      </div>

      <div style={{marginTop:12,display:'flex',gap:8,alignItems:'center'}}>
        <button onClick={clearSelection}>Clear</button>
        <button onClick={() => {
          const predicate = (it: PhrasalItem) => !!(it.meaning && it.meaning.includes('to'));
          const selectedIdx = Object.keys(selected).filter(k=>selected[Number(k)]).map(k=>Number(k));
          const result = evaluatePhrasalMultiSelect(selectedIdx, pool, predicate);
          // eslint-disable-next-line no-alert
          alert(`Correct: ${result.correct} / ${result.totalCorrect}`);
        }}>Check</button>

        <div style={{marginLeft:'auto',fontSize:13,opacity:0.8}}>
          Selezionati: {buildAnswerPreview().length}
        </div>
      </div>
    </div>
  );
}
// ...existing code...