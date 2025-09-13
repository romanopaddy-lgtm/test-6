import React, { useMemo, useState } from 'react';
import { useLevel } from '@/contexts/LevelContext';
import { getPhrasal } from '@/services/datasetLoader';
import { addOrUpdateError } from '@/services/errorService';

type Item = { verb?: string; meaning?: string; level?: string; [k:string]: any };

function shuffle<T>(arr:T[]){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function buildOptions(pool: Item[], correctIdx:number, count=4){
  const correct = pool[correctIdx];
  const others = pool.filter((_,i)=>i!==correctIdx);
  const picks: Item[] = [];
  for (let i=0;i<Math.min(count-1, others.length); i++){
    const r = Math.floor(Math.random()*others.length);
    picks.push(others.splice(r,1)[0]);
  }
  return shuffle([correct, ...picks]);
}

export default function PhrasalExercise(): JSX.Element {
  const { level } = useLevel();
  const pool = useMemo(()=> getPhrasal(level) ?? [], [level]);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<'mc'|'write'>('mc');
  const [reverse, setReverse] = useState(false);
  const [selected, setSelected] = useState<number|null>(null);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);

  if (!Array.isArray(pool) || pool.length === 0) {
    return <div style={{padding:12}}>Nessun esercizio disponibile per questo livello.</div>;
  }

  const idx = index % pool.length;
  const item = pool[idx];
  const options = useMemo(()=> buildOptions(pool, idx, 4), [pool, idx, index, reverse]);

  function checkAnswer(){
    setChecked(true);

    const isCorrect = mode === 'mc'
      ? selected === correctOptionIndex
      : input.trim().toLowerCase() === (correctKey || '').toLowerCase();

    if (!isCorrect) {
      try {
        const promptText = reverse ? (item.meaning || '') : (item.verb || '');
        const expectedText = reverse ? (item.verb || '') : (item.meaning || '');
        const userAnswerText = mode === 'mc'
          ? String(selected !== null && options[selected] ? (reverse ? (options[selected].verb || '') : (options[selected].meaning || '')) : '')
          : input;

        addOrUpdateError({
          type: 'phrasal',
          level: level || undefined,
          prompt: promptText,
          expected: expectedText,
          userAnswer: userAnswerText
        });
        console.debug('[PhrasalExercise] addOrUpdateError called', { prompt: promptText, expected: expectedText, userAnswer: userAnswerText });
      } catch (err) {
        console.error('[PhrasalExercise] addOrUpdateError failed', err);
      }
    }
  }
  function next(){ setIndex(i=>i+1); setSelected(null); setInput(''); setChecked(false); }

  function play(text?:string){
    if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(u);
  }

  const correctKey = reverse ? (item.verb||'') : (item.meaning||'');
  const correctOptionIndex = options.findIndex(o => (reverse ? (o.verb||'') : (o.meaning||'')) === correctKey);

  return (
    <div style={{maxWidth:900,margin:'0 auto',padding:12}}>
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <div style={{fontSize:13,opacity:0.8}}>Phrasal verbs — livello: {level}</div>
        <label style={{marginLeft:8,fontSize:13}}><input type="checkbox" checked={reverse} onChange={()=>{setReverse(r=>!r); setChecked(false); setSelected(null);}}/> Reverse</label>
        <label style={{marginLeft:8,fontSize:13}}><input type="radio" checked={mode==='mc'} onChange={()=>setMode('mc')}/> MC</label>
        <label style={{marginLeft:4,fontSize:13}}><input type="radio" checked={mode==='write'} onChange={()=>setMode('write')}/> Write</label>
      </div>

      <div style={{marginTop:12,padding:12,border:'1px solid #eee',borderRadius:6}}>
        <div style={{fontSize:18,fontWeight:600}}>{reverse ? (item.meaning || '—') : (item.verb || '—')}</div>
        <div style={{marginTop:10}}>
          <button onClick={()=>play(reverse?item.meaning:item.verb)}>Play</button>
        </div>

        {mode === 'mc' ? (
          <div style={{marginTop:12,display:'grid',gap:8}}>
            {options.map((opt,i)=> {
              const label = reverse ? (opt.verb || '—') : (opt.meaning || '—');
              const isSelected = selected === i;
              const isCorrect = checked && i === correctOptionIndex;
              const isWrong = checked && isSelected && i !== correctOptionIndex;
              return (
                <label
                  key={i}
                  onClick={()=>!checked && setSelected(i)}
                  style={{
                    display:'flex',
                    alignItems:'center',
                    gap:8,
                    padding:10,
                    borderRadius:6,
                    cursor: checked ? 'default' : 'pointer',
                    background: isCorrect ? '#e6ffed' : isWrong ? '#ffecec' : '#fff',
                    border: isCorrect ? '1px solid #8ae39d' : isWrong ? '1px solid #f5a6a6' : '1px solid #eee'
                  }}
                >
                  <input
                    type="radio"
                    readOnly
                    checked={isSelected}
                    style={{margin:0}}
                  />
                  <span>{label}</span>
                </label>
              );
            })}
          </div>
        ) : (
          <div style={{marginTop:12}}>
            <input
              value={input}
              onChange={e=>{ setInput(e.target.value); if (checked) setChecked(false); }}
              placeholder={reverse ? 'Digita il verbo' : 'Digita il significato'}
              style={{width:'100%',padding:8,border:'1px solid #ccc',borderRadius:4}}
            />
          </div>
        )}

        <div style={{marginTop:16,display:'flex',alignItems:'center',gap:12}}>
          {!checked ? (
            <button
              onClick={checkAnswer}
              disabled={mode==='mc' ? selected===null : input.trim()===''}
            >Verifica</button>
          ) : (
            <button onClick={next}>Avanti</button>
          )}
          <div style={{fontSize:14}}>
            {checked ? (
              mode==='mc'
                ? (correctOptionIndex===selected
                    ? 'Corretto ✅'
                    : `Sbagliato — risposta corretta: ${reverse ? (options[correctOptionIndex]?.verb || '') : (options[correctOptionIndex]?.meaning || '')}`)
                : (input.trim().toLowerCase() === correctKey.toLowerCase()
                    ? 'Corretto ✅'
                    : `Risposta corretta: ${correctKey}`)
            ) : `Item ${idx+1} / ${pool.length}`}
          </div>
        </div>
      </div>
    </div>
  );
}

