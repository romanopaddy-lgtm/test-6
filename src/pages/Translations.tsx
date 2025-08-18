import React from 'react';
import TranslationExercise from '@/components/TranslationExercise';
import { useLevel } from '@/contexts/LevelContext';

export default function Translations(): JSX.Element {
  const { level } = useLevel();
  return (
    <div style={{ padding: 12 }}>
      <h2>Translations — livello: {level}</h2>
      <TranslationExercise />
    </div>
  );
}