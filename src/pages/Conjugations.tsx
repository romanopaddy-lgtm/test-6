import React from 'react';
import ConjugationExercise from '@/components/ConjugationExercise';
import { useLevel } from '@/contexts/LevelContext';

export default function Conjugations(): JSX.Element {
  const { level } = useLevel();

  return (
    <div style={{ padding: 12 }}>
      <h2>Conjugations — livello: {level}</h2>
      <ConjugationExercise />
    </div>
  );
}