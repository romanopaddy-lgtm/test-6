// ...existing code...
import React, { createContext, useContext, useState } from 'react';

export type LevelType = 'A1'|'A2'|'B1'|'B2'|'C1'|'C2'|'Adaptive';

type LevelContextType = {
  level: LevelType;
  setLevel: (l: LevelType) => void;
};

const LevelContext = createContext<LevelContextType | undefined>(undefined);

export const LevelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [level, setLevel] = useState<LevelType>('A1');
  return (
    <LevelContext.Provider value={{ level, setLevel }}>
      {children}
    </LevelContext.Provider>
  );
};

export function useLevel() {
  const ctx = useContext(LevelContext);
  if (!ctx) throw new Error('useLevel must be used within LevelProvider');
  return ctx;
}
// ...existing code...