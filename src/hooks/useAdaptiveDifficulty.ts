// ...existing code...
import { useEffect, useMemo, useState } from 'react';
import { CEFR } from '../types/levels';
import { getEMA, updateEMA } from '../services/progressService';

const THRESHOLDS: Array<{ min: number; level: CEFR }> = [
  { min: 0.0, level: 'A1' },
  { min: 0.55, level: 'A2' },
  { min: 0.65, level: 'B1' },
  { min: 0.75, level: 'B2' },
  { min: 0.85, level: 'C1' },
  { min: 0.93, level: 'C2' },
];

function levelFromScore(s: number): CEFR {
  let chosen: CEFR = 'A1';
  const score = Number.isFinite(s) ? Math.max(0, Math.min(1, s)) : 0;
  for (const t of THRESHOLDS) {
    if (score >= t.min) chosen = t.level;
  }
  return chosen;
}

/* Safe wrappers that tolerate different progressService signatures/returns */
function safeGetEMA(category: string): number | undefined {
  try {
    const fn = (getEMA as unknown) as (...args: any[]) => any;
    const res = fn(category);
    if (res == null) return undefined;
    if (typeof res === 'number') return Number(res);
    if (typeof res === 'object' && typeof (res as any).value === 'number') return Number((res as any).value);
  } catch (_) {
    /* ignore */
  }
  return undefined;
}

function safeUpdateEMA(category: string, sample: number): number | undefined {
  try {
    const fn = (updateEMA as unknown) as (...args: any[]) => any;
    const res = fn(category, sample);
    if (res == null) return undefined;
    if (typeof res === 'number') return Number(res);
    if (typeof res === 'object' && typeof (res as any).value === 'number') return Number((res as any).value);
  } catch (_) {
    /* ignore */
  }
  return undefined;
}

export function useAdaptiveDifficulty(category: string = 'translations'): {
  ema: number;
  level: CEFR;
  recordResult: (correct: boolean) => void;
} {
  const initialEma = safeGetEMA(category) ?? 0.5;
  const [ema, setEma] = useState<number>(initialEma);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = safeGetEMA(category);
    if (typeof stored === 'number') setEma(stored);

    const onStorage = (e: StorageEvent) => {
      try {
        if (e.key !== 'panda.progress.v1') return;
        const s = safeGetEMA(category);
        if (typeof s === 'number') setEma(s);
      } catch (_) {
        /* ignore */
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [category]);

  const level = useMemo(() => levelFromScore(ema), [ema]);

  const recordResult = (correct: boolean) => {
    const sample = correct ? 1 : 0;
    const v = safeUpdateEMA(category, sample);
    if (typeof v === 'number' && Number.isFinite(v)) {
      setEma(v);
    }
  };

  return { ema, level, recordResult };
}