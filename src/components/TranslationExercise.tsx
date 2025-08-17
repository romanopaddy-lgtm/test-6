import React, { useMemo, useRef, useState } from 'react';
import { getTranslationItems, TranslationItem } from '../data/index';
import { useAdaptiveDifficulty } from '../hooks/useAdaptiveDifficulty';

type Direction = 'EN→IT' | 'IT→EN';
type Mode = 'Adaptive' | 'Manual';

function normalize(s: string){ return s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/\s+/g,' ').trim(); }
function pick<T>(items:T[], count:number){ const a=[...items]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a.slice(0,count); }

export default function TranslationExerciseA1(){
  const [direction,setDirection] = useState<Direction>('EN→IT');
  const [subcategory,setSubcategory] = useState<'adjectives'|'verbs'|'nouns'>('adjectives');
  const [mode, setMode] = useState<Mode>('Adaptive');

  const { ema, level, recordResult } = useAdaptiveDifficulty('translations');
  const items = useMemo(()=> getTranslationItems(level), [level]);
  const manualItems = useMemo(()=> getTranslationItems('A1'), []); // manual fallback for A1

  const poolSource = mode === 'Adaptive' ? items : manualItems;
  const pool = useMemo(()=> poolSource.filter(i=>i.subcategory===subcategory), [poolSource, subcategory]);
  const questions = useMemo(()=> pick(pool, Math.min(10, pool.length)), [pool]);

  const [index,setIndex]=useState(0);
  const [value,setValue]=useState('');
  const [correctCount,setCorrectCount]=useState(0);
  const [checked,setChecked]=useState<null|boolean>(null);
  const [revealed,setRevealed]=useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = questions[index] as TranslationItem;
  const prompt = direction==='EN→IT'? q.en : q.it;
  const answer = direction==='EN→IT'? q.it : q.en;

  const onCheck = ()=>{
    if(revealed) return;
    const ok = normalize(value) === normalize(answer);
    setChecked(ok);
    if(ok) setCorrectCount(c=>c+1);
    recordResult(ok);
  };
  const onNext = ()=>{
    if(index < questions.length-1){ setIndex(i=>i+1); setValue(''); setChecked(null); setRevealed(false); inputRef.current?.focus(); }
  };
  const onReveal = ()=> setRevealed(true);
  const restart = ()=>{ setIndex(0); setValue(''); setCorrectCount(0); setChecked(null); setRevealed(false); }

  const speakPrompt = ()=>{
    try{
      const text = direction==='EN→IT'? q.en : q.it;
      const lang = direction==='EN→IT' ? 'en-GB' : 'it-IT';
      if('speechSynthesis' in window){
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      }
    }catch(e){}
  };

  return (
    <div className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center', gap:8, flexWrap:'wrap'}}>
        <h3 style={{margin:0}}>Translations • {mode === 'Adaptive' ? `Auto (${level})` : 'Manual (A1)'}</h3>
        <div className="controls">
          <label className="muted">Mode</label>
          <button onClick={()=> setMode(m => m==='Adaptive' ? 'Manual' : 'Adaptive')}>{mode}</button>
          <label className="muted">Direction</label>
          <button onClick={()=>setDirection(d=> d==='EN→IT' ? 'IT→EN' : 'EN→IT')}>{direction}</button>
        </div>
      </div>

      <div className="muted" style={{marginTop:6}}>EMA: {ema.toFixed(2)} → Recommended level: <b>{level}</b></div>

      <div style={{marginTop:12}} className="controls">
        <label className="muted">Category</label>
        <button onClick={()=>setSubcategory('adjectives')} style={{background: subcategory==='adjectives'? '#efefef':'white'}}>Adjectives</button>
        <button onClick={()=>setSubcategory('verbs')} style={{background: subcategory==='verbs'? '#efefef':'white'}}>Verbs</button>
        <button onClick={()=>setSubcategory('nouns')} style={{background: subcategory==='nouns'? '#efefef':'white'}}>Nouns</button>
      </div>

      <div style={{display:'flex',justifyContent:'space-between',marginTop:8}} className="muted">
        <div>Q{index+1}/{questions.length}</div>
        <div>Score: {correctCount}</div>
      </div>

      <div style={{marginTop:12, padding:12, borderRadius:8, border:'1px solid #e6e6e6', background:'#fff'}}>
        <div style={{fontSize:18, marginBottom:8}}>{prompt}</div>
        <div style={{display:'flex',gap:8}}>
          <input ref={inputRef} placeholder={direction==='EN→IT'? 'Scrivi la traduzione in italiano' : 'Type the English translation'} value={value} onChange={e=>setValue(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') onCheck(); }} />
          <button onClick={onCheck}>Check</button>
          <button onClick={onReveal}>Reveal</button>
          <button onClick={speakPrompt}>🔊</button>
        </div>
        {(checked !== null || revealed) && (
          <div style={{marginTop:10}}>
            {checked ? <div style={{color:'#059669'}}>Correct!</div> : <div style={{color:'#dc2626'}}>Answer: <b>{answer}</b></div>}
          </div>
        )}
      </div>
      <div style={{display:'flex',justifyContent:'space-between', marginTop:12}}>
        <button onClick={restart}>Restart</button>
        <button onClick={onNext} disabled={index >= questions.length-1}>Next</button>
      </div>
    </div>
  )
}


// Fix placeholder
export function getTranslationItems() {
  return [];
}
