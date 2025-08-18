import React from 'react';
import TranslationExercise from '@/components/TranslationExercise';
import { useLevel } from '@/contexts/LevelContext';
import { getTranslations } from '@/services/datasetLoader';

export default function Translations(): JSX.Element {
  const { level } = useLevel();
  const t = getTranslations(level);
  const hasItems = (t.verbs?.length || 0) + (t.nouns?.length || 0) + (t.adjectives?.length || 0) > 0;

  return (
    <div style={{padding:12}}>
      <h2>Translations — livello: {level}</h2>
      {!hasItems ? (
        <div style={{padding:16,background:'#fff7e6',borderRadius:6}}>Nessun esercizio disponibile per questo livello.</div>
      ) : (
        <TranslationExercise />
      )}
    </div>
  );
}