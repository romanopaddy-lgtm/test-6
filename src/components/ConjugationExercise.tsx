import React, { useMemo, useState } from 'react';
import { useLevel } from '@/contexts/LevelContext';
import { getConjugations } from '@/services/datasetLoader';

function normalize(s?:string){ return (s||'').toLowerCase().replace(/\s+/g,' ').trim(); }

export default function ConjugationExercise(): JSX.Element {
  const { level } = useLevel();
  const conjObj = useMemo(()=> getConjugations(level) || {}, [level]);
  const verbs = Object.keys(conjObj);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);

  const tensesByLevel: Record<string,string[]> = {
    'A1': ['present_simple'],
    'A2': ['present_simple','past_simple'],
  };

  if (!verbs.length) return <div style={{padding:12}}>Nessuna coniugazione disponibile per questo livello.</div>;

  const verb = verbs[idx % verbs.length];
  const lvl = (String(level).toUpperCase() === 'ADAPTIVE') ? (Math.random()<0.5?'A1':'A2') : String(level).toUpperCase();
  const allowed = tensesByLevel[lvl] || ['present_simple'];
  const tense = allowed[Math.floor(Math.random()*allowed.length)];

  const persons = [
    {code:'1s', label:'I', person: '1s'},
    {code:'2s', label:'you', person: '2s'},
    {code:'3s', label:'he/she/it', person: '3s'},
    {code:'1p', label:'we', person: '1p'},
    {code:'2p', label:'you (pl)', person: '2p'},
    {code:'3p', label:'they', person: '3p'},
  ];
  const p = persons[Math.floor(Math.random()*persons.length)];

  const expectedFromData = conjObj[verb] && conjObj[verb][tense] && conjObj[verb][tense][p.person];
  let expected = expectedFromData || '';

  if (!expected) {
    if (tense === 'present_simple') {
      if (p.person === '3s') expected = `${verb}${verb.endsWith('s') ? '' : 's'}`;
      else expected = verb;
    } else if (tense === 'past_simple') {
      expected = verb.endsWith('e') ? `${verb}d` : `${verb}ed`;
    }
  }

  function check(){ setChecked(true); }
  function next(){ setIdx(i=>i+1); setInput(''); setChecked(false); }

  return (
    <div style={{maxWidth:900,margin:'0 auto',padding:12}}>
      <div style={{fontSize:13,opacity:0.8}}>Conjugations — livello: {level}</div>

      <div style={{marginTop:12,padding:12,border:'1px solid #eee',borderRadius:6}}>
        <div style={{fontSize:18,fontWeight:600}}>{p.label} — {tense.replace('_',' ') } — {verb}</div>

        <div style={{marginTop:12}}>
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Inserisci forma corretta" style={{width:'100%',padding:8}} />
        </div>

        <div style={{marginTop:12,display:'flex',gap:8}}>
          <button onClick={check} disabled={checked || input.trim()===''}>Check</button>
          <button onClick={next}>Next</button>
          <div style={{marginLeft:'auto',fontSize:13,opacity:0.8}}>
            {checked ? (normalize(input) === normalize(expected) ? 'Corretto ✅' : `Sbagliato — risposta: ${expected}`) : `Item ${idx+1} / ${verbs.length}`}
          </div>
        </div>
      </div>
    </div>
  );
}