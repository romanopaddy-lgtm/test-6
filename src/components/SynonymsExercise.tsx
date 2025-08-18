import React, { useMemo, useState } from 'react';
import { useLevel } from '@/contexts/LevelContext';
import { getTranslations } from '@/services/datasetLoader';

function normalize(s?:string){ return (s||'').toLowerCase().trim(); }

export default function SynonymsExercise(): JSX.Element {
  const { level } = useLevel();
  const t = useMemo(()=> getTranslations(level), [level]);
  const pool = useMemo(()=> {
    const candidates = [...(t.adjectives||[]), ...(t.verbs||[]), ...(t.nouns||[])].slice();
    return candidates;
  }, [t]);

  const [idx, setIdx] = useState(0);
  const [mode, setMode] = useState<'mc'|'write'>('mc');
  const [selected, setSelected] = useState<number|null>(null);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);

  if (!pool.length) return <div style={{padding:12}}>Nessun contenuto disponibile per questo livello.</div>;

  const raw = pool[idx % pool.length];
  const word = typeof raw === 'string' ? raw : (raw.word || raw.text || raw.base || raw.eng || raw.ita || JSON.stringify(raw));
  const corrects: string[] = typeof raw === 'object' && raw.synonyms ? raw.synonyms.map((s:any)=>String(s)) : [typeof raw === 'string' ? raw : (raw.synonym || raw.alt || word)];

  const options = useMemo(()=>{
    const all = pool.map(p=> typeof p === 'string' ? p : (p.word || p.text || p.base || p.eng || p.ita)).filter(Boolean) as string[];
    const opts = [corrects[0]];
    const poolCopy = all.filter(x=> normalize(x)!==normalize(corrects[0])).slice();
    while (opts.length < 4 && poolCopy.length){
      const r = Math.floor(Math.random()*poolCopy.length);
      opts.push(poolCopy.splice(r,1)[0]);
    }
    return opts.sort(()=>Math.random()-0.5);
  },[idx, pool]);

  function check(){ setChecked(true); }
  function next(){ setIdx(i=>i+1); setChecked(false); setSelected(null); setInput(''); }

  const correctInMCIndex = options.findIndex(o => corrects.some(c=> normalize(c) === normalize(o)));

  return (
    <div style={{maxWidth:900,margin:'0 auto',padding:12}}>
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <div style={{fontSize:13,opacity:0.8}}>Synonyms — livello: {level}</div>
        <label style={{marginLeft:8}}><input type="radio" checked={mode==='mc'} onChange={()=>setMode('mc')}/> MC</label>
        <label style={{marginLeft:8}}><input type="radio" checked={mode==='write'} onChange={()=>setMode('write')}/> Write</label>
      </div>

      <div style={{marginTop:12,padding:12,border:'1px solid #eee',borderRadius:6}}>
        <div style={{fontSize:20,fontWeight:600}}>{word}</div>

        {mode==='mc' ? (
          <div style={{marginTop:12,display:'grid',gap:8}}>
            {options.map((opt,i)=> (
              <label key={i} onClick={()=>!checked && setSelected(i)} style={{display:'flex',alignItems:'center',gap:8,padding:8,borderRadius:6,background: checked && i===correctInMCIndex ? '#e6ffed' : checked && selected===i ? '#ffecec' : '#fff', border:'1px solid #eee', cursor: checked ? 'default' : 'pointer' }}>
                <input type="radio" checked={selected===i} readOnly/>
                <div>{opt}</div>
              </label>
            ))}
          </div>
        ) : (
          <div style={{marginTop:12}}>
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Inserisci un sinonimo" style={{width:'100%',padding:8}} />
          </div>
        )}

        <div style={{marginTop:12,display:'flex',gap:8}}>
          <button onClick={check} disabled={checked || (mode==='mc' ? selected===null : input.trim()==='')}>Check</button>
          <button onClick={next}>Next</button>
          <div style={{marginLeft:'auto',fontSize:13,opacity:0.8}}>
            {checked ? (
              mode==='mc' ? (selected === correctInMCIndex ? 'Corretto ✅' : `Sbagliato — risposte possibili: ${corrects.join(', ')}`) :
              ( corrects.some(c=> normalize(c) === normalize(input)) ? 'Corretto ✅' : `Sbagliato — risposte possibili: ${corrects.join(', ')}` )
            ) : `Item ${idx+1} / ${pool.length}`}
          </div>
        </div>
      </div>
    </div>
  );
}