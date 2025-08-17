import { useEffect, useMemo, useState } from 'react';
import { CEFR } from '../types/levels';
import { getEMA, updateEMA } from '../services/progressService';

const THRESHOLDS: Array<{min:number, level: CEFR}> = [
  { min: 0.00, level: 'A1' },
  { min: 0.55, level: 'A2' },
  { min: 0.65, level: 'B1' },
  { min: 0.75, level: 'B2' },
  { min: 0.85, level: 'C1' },
  { min: 0.93, level: 'C2' },
];

function levelFromScore(s: number): CEFR {
  let chosen: CEFR = 'A1';
  for (const t of THRESHOLDS) {
    if (s >= t.min) chosen = t.level;
  }
  return chosen;
}

export function useAdaptiveDifficulty(category: 'translations'){
  const [ema, setEma] = useState<number>(() => getEMA(category)?.value ?? 0.5);

  useEffect(()=>{
    // sync from storage on mount (in case another tab updated it)
    const stored = getEMA(category)?.value;
    if (typeof stored === 'number') setEma(stored);
    // also listen to storage events
    const onStorage = (e: StorageEvent) => {
      if(e.key === 'panda.progress.v1'){
        const s = getEMA(category)?.value;
        if(typeof s === 'number') setEma(s);
      }
    };
    window.addEventListener('storage', onStorage);
    return ()=> window.removeEventListener('storage', onStorage);
  }, [category]);

  const level = useMemo(()=> levelFromScore(ema), [ema]);
  const recordResult = (correct: boolean) => {
    const sample = correct ? 1 : 0;
    const v = updateEMA(category, sample);
    setEma(v);
  };
  return { ema, level, recordResult };
}
