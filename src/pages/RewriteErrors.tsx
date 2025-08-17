import React, { useEffect, useState } from 'react';
import { getErrors, incrementError, markCorrected } from '../services/errorService';
import { generateRewriteExerciseFromError } from '@/services/gptStub';

function normalize(s: string){ return (s||'').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/\s+/g,' ').trim(); }

export default function RewriteErrorsPage(){
  const [errors, setErrors] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState<null|string>(null);

  useEffect(()=> setErrors(getErrors()), []);

  const current = errors[index];

  const onSubmit = ()=>{
    if(!current) return;
    const expected = normalize(current.expected || '');
    const attempt = normalize(value);
    if(attempt === expected){
      // correct: remove error
      markCorrected(current.id);
      const updated = getErrors();
      setErrors(updated);
      setIndex(i => Math.min(i, Math.max(0, updated.length-1)));
      setValue('');
      setFeedback('Correct — removed from errors.');
    } else {
      // incorrect: increment counter
      incrementError(current.id);
      setFeedback('Not correct yet — try again.');
      // refresh errors to update counts
      setErrors(getErrors());
    }
  };

  const onNext = ()=>{ setIndex(i=> Math.min(errors.length-1, i+1)); setValue(''); setFeedback(null); }
  const onPrev = ()=>{ setIndex(i=> Math.max(0, i-1)); setValue(''); setFeedback(null); }

  if(!errors || errors.length === 0) return (
    <div className="card">
      <h3>Rewrite Errors</h3>
      <p className="muted">No errors saved. Make mistakes in exercises to populate this list.</p>
    </div>
  );

  return (
    <div className="card">
      <h3>Rewrite Errors</h3>
      <div className="muted">Item {index+1}/{errors.length} • Attempts: {current.count}</div>
      <div style={{marginTop:12}}>
        <div><b>Prompt:</b> {current.prompt}</div>
        <div style={{marginTop:8}}><b>Expected:</b> <i>{current.expected}</i></div>
        <div style={{marginTop:12}}>
          <input style={{minWidth:300,padding:8}} value={value} onChange={e=>setValue(e.target.value)} placeholder="Rewrite the sentence / provide the correct form" />
          <div style={{marginTop:8}}>
            <button onClick={onSubmit}>Submit</button>
            <button style={{marginLeft:8}} onClick={onPrev} disabled={index<=0}>Prev</button>
            <button style={{marginLeft:8}} onClick={onNext} disabled={index>=errors.length-1}>Next</button>
          </div>
          {feedback && <div style={{marginTop:8}}>{feedback}</div>}
        </div>
      </div>
    </div>
  )
}
