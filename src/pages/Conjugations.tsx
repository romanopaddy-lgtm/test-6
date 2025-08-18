import React from 'react';
import ConjugationExercise from '@/components/ConjugationExercise';
import { useLevel } from '@/contexts/LevelContext';
import { getConjugations } from '@/services/datasetLoader';

export default function Conjugations(): JSX.Element {
  const { level } = useLevel();
  const obj = getConjugations(level) || {};
  const has = Object.keys(obj).length > 0;

  return (
    <div style={{padding:12}}>
      <h2>Conjugations — livello: {level}</h2>
      {!has ? (
        <div style={{padding:16,background:'#fff7e6',borderRadius:6}}>Nessuna coniugazione disponibile per questo livello.</div>
      ) : (
        <ConjugationExercise />
      )}
    </div>
  );
}