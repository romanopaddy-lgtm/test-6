// ...existing code...
import React from 'react';
import { useLevel } from '@/contexts/LevelContext';

const OPTIONS: Array<ReturnType<typeof useLevel>['level']> = ['A1','A2','B1','B2','C1','C2','Adaptive'];

export default function LevelSelector(){
  const { level, setLevel } = useLevel();
  return (
    <div style={{display:'inline-flex',alignItems:'center',gap:8}}>
      <label style={{fontSize:12,opacity:0.7}}>Level</label>
      <select
        value={level}
        onChange={e => setLevel(e.target.value as any)}
        aria-label="Select level"
      >
        {OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
// ...existing code...