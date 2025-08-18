// ...existing code...
import React, { useMemo, useState } from 'react';
import { useLevel } from '@/contexts/LevelContext';
import { getConjugations } from '@/services/datasetLoader';

export default function ConjugationExercise(): JSX.Element {
  const { level } = useLevel();
  const conjObj = useMemo(()=> getConjugations(level) || {}, [level]);
  const verbs = Object.keys(conjObj);
  const [idx, setIdx] = useState(0);
  const verb = verbs.length ? verbs[idx % verbs.length] : '';

  function next(){ setIdx(i=>i+1); }

  return (
    <div style={{maxWidth:900,margin:'0 auto',padding:12}}>
      <div style={{fontSize:13,opacity:0.75}}>Conjugations — livello: {level}</div>
      {verb ? (
        <div style={{marginTop:12}}>
          <div style={{fontSize:18,fontWeight:600}}>{verb}</div>
          <pre style={{background:'#fafafa',padding:12,borderRadius:6,whiteSpace:'pre-wrap'}}>
            {JSON.stringify(conjObj[verb], null, 2)}
          </pre>
        </div>
      ) : (
        <div style={{marginTop:12}}>Nessuna coniugazione disponibile per questo livello.</div>
      )}
      <div style={{marginTop:12}}>
        <button onClick={next}>Next</button>
      </div>
    </div>
  );
}
// ...existing code...