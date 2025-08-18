import React, { useEffect, useState } from 'react';
import { useLevel } from '@/contexts/LevelContext';
import { getPhrasal } from '@/services/datasetLoader';

export default function PhrasalExercise(){
  const { level } = useLevel();
  const list = getPhrasal(level) ?? [];
  const [index, setIndex] = useState(0);
  const item = list.length ? list[index % list.length] : { verb: '', meaning: '' };

  useEffect(()=>{
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return () => { if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, []);

  function play(text: string){
    if (typeof window === 'undefined' || !text || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(u);
  }

  return (
    <div style={{maxWidth:800,margin:'0 auto',padding:16}}>
      <div style={{fontSize:13,opacity:0.75}}>Phrasal verbs — livello: {level}</div>
      <div style={{fontSize:20,fontWeight:600,marginTop:8}}>{item.verb || '—'}</div>
      <div style={{fontSize:13,opacity:0.65,marginTop:6}}>{item.meaning || ''}</div>
      <div style={{display:'flex',gap:8,marginTop:12}}>
        <button onClick={()=>play(item.verb)}>Play verb</button>
        <button onClick={()=>play(item.meaning)}>Play meaning</button>
        <button onClick={()=>setIndex(i=>i+1)}>Next</button>
      </div>
    </div>
  );
}