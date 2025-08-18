// ...existing code...
import React, { useMemo } from 'react';
import { useLevel } from '@/contexts/LevelContext';
import { getTranslations } from '@/services/datasetLoader';

export default function SynonymsExercise(): JSX.Element {
  const { level } = useLevel();
  const translations = useMemo(()=> getTranslations(level), [level]);

  const verbs = (translations.verbs||[]).slice(0,20);
  const nouns = (translations.nouns||[]).slice(0,20);
  const adjs  = (translations.adjectives||[]).slice(0,20);

  return (
    <div style={{maxWidth:1000,margin:'0 auto',padding:12}}>
      <div style={{fontSize:13,opacity:0.75}}>Synonyms / consultation — livello: {level}</div>
      <div style={{display:'flex',gap:12,marginTop:12,flexWrap:'wrap'}}>
        <section style={{flex:1,minWidth:200}}>
          <h4>Verbs</h4>
          <ul>{verbs.map((v:any,i)=> <li key={i}>{typeof v === 'string' ? v : JSON.stringify(v)}</li>)}</ul>
        </section>
        <section style={{flex:1,minWidth:200}}>
          <h4>Nouns</h4>
          <ul>{nouns.map((v:any,i)=> <li key={i}>{typeof v === 'string' ? v : JSON.stringify(v)}</li>)}</ul>
        </section>
        <section style={{flex:1,minWidth:200}}>
          <h4>Adjectives</h4>
          <ul>{adjs.map((v:any,i)=> <li key={i}>{typeof v === 'string' ? v : JSON.stringify(v)}</li>)}</ul>
        </section>
      </div>
    </div>
  );
}
// ...existing code...