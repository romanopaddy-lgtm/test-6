import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type LevelType = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Adaptive';

type LevelContextType = {
  level: LevelType;
  setLevel: (l: LevelType) => void;
  available: LevelType[];
};

const STORAGE_KEY = 'app_level_v1';
const DEFAULT_LEVEL: LevelType = 'A1';

const LevelContext = createContext<LevelContextType | undefined>(undefined);

export function LevelProvider({ children }: { children: React.ReactNode }) {
  const [level, setLevelState] = useState<LevelType>(() => {
    try {
      if (typeof window === 'undefined') return DEFAULT_LEVEL;
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return DEFAULT_LEVEL;
      const v = stored as LevelType;
      return (['A1','A2','B1','B2','C1','C2','Adaptive'] as LevelType[]).includes(v) ? v : DEFAULT_LEVEL;
    } catch {
      return DEFAULT_LEVEL;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, level);
    } catch { /* ignore */ }
  }, [level]);

  const setLevel = (l: LevelType) => {
    setLevelState(l);
  };

  const available = useMemo<LevelType[]>(() => ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Adaptive'], []);

  return (
    <LevelContext.Provider value={{ level, setLevel, available }}>
      {children}
    </LevelContext.Provider>
  );
}

export function useLevel(): LevelContextType {
  const ctx = useContext(LevelContext);
  if (!ctx) throw new Error('useLevel must be used within LevelProvider');
  return ctx;
}

// default export for compatibility with any default imports
export default LevelProvider;