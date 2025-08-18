import React from 'react';
import SynonymsExercise from '@/components/SynonymsExercise';
import { useLevel } from '@/contexts/LevelContext';
import { getTranslations } from '@/services/datasetLoader';

export default function Synonyms(): JSX.Element {
  const { level } = useLevel();
  const t = getTranslations(level);
  const has = (t.adjectives?.length || 0) + (t.verbs?.length || 0) + (t.nouns?.length || 0) > 0;

  return (
    <div style={{padding:12}}>
      <h2>Synonyms — livello: {level}</h2>
      {!has ? (
        <div style={{padding:16,background:'#fff7e6',borderRadius:6}}>Nessun contenuto disponibile per questo livello.</div>
      ) : (
        <SynonymsExercise />
      )}
    </div>
  );
}