// ...existing code...
import React from 'react';
import PhrasalExercise from '@/components/PhrasalExercise';
import PhrasalVerbsMultiSelect from '@/components/PhrasalVerbsMultiSelect';
import { useLevel } from '@/contexts/LevelContext';
import { getPhrasal } from '@/services/datasetLoader'; // se nel progetto il file è datasetLoader.ts modifica import di conseguenza

// ...existing code...
export default function PhrasalVerbs(): JSX.Element {
  const { level } = useLevel();
  const pool = (getPhrasal(level) ?? []) as any[];
  if (!Array.isArray(pool) || pool.length === 0) {
    return (
      <div style={{padding:12}}>
        <h2>Phrasal verbs — livello: {level}</h2>
        <div style={{padding:16,background:'#fff7e6',borderRadius:6}}>Nessun esercizio disponibile per questo livello.</div>
      </div>
    );
  }

  return (
    <div style={{padding:12}}>
      <h2>Phrasal verbs — livello: {level}</h2>
      <PhrasalExercise />
      <hr style={{margin:'16px 0'}} />
      <PhrasalVerbsMultiSelect />
    </div>
  );
}
// ...existing code...