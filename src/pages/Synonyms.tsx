import React from 'react';
import SynonymsExercise from '@/components/SynonymsExercise';
import { useLevel } from '@/contexts/LevelContext';

export default function Synonyms(): JSX.Element {
  const { level } = useLevel();

  return (
    <div style={{ padding: 12 }}>
      <h2>Synonyms — livello: {level}</h2>
      <SynonymsExercise />
    </div>
  );
}