// ...existing code...
import React, { useMemo, useState } from 'react';
import { useLevel } from '@/contexts/LevelContext';
import { getTranslations } from '@/services/datasetLoader';

export default function TranslationExercise(): JSX.Element {
  const { level } = useLevel();
  const translations = useMemo(()=> getTranslations(level), [level]);
  const pool = useMemo(()=> {
    const items = [
      ...(translations.verbs||[]).map((t:any) => ({ type: 'verb', text: typeof t === 'string' ? t : (t.word || JSON.stringify(t)) })),
      ...(translations.nouns||[]).map((t:any) => ({ type: 'noun', text: typeof t === 'string' ? t : (t.word || JSON.stringify(t)) })),
      ...(translations.adjectives||[]).map((t:any) => ({ type: 'adj', text: typeof t === 'string' ? t : (t.word || JSON.stringify(t)) })),
    ];
    return items;
  }, [translations]);

  const [idx, setIdx] = useState(0);
  const item = pool.length ? pool[idx % pool.length] : { text: '—', type: '' };

  function next(){ setIdx(i=>i+1); }

  return (
    <div style={{maxWidth:800,margin:'0 auto',padding:16}}>
      <div style={{fontSize:13,opacity:0.75}}>Translation exercise — livello: {level}</div>
      <div style={{fontSize:20,fontWeight:600,marginTop:12}}>{item.text}</div>
      <div style={{marginTop:12,display:'flex',gap:8}}>
        <button onClick={next}>Next</button>
      </div>
    </div>
  );
}
// ...existing code...