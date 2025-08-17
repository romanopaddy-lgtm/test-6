import React, { useEffect, useState } from 'react';
import { getErrors, markCorrected, clearAllErrors } from '../services/errorService';

export default function ErrorsPage(){
  const [errors, setErrors] = useState<any[]>([]);
  useEffect(()=>{ setErrors(getErrors()); }, []);

  const refresh = ()=> setErrors(getErrors());
  return (
    <div className="card">
      <h3>Saved Errors</h3>
      <p className="muted">These are user mistakes saved for review. Use Rewrite to practice them.</p>
      <div style={{marginTop:12}}>
        {errors.length === 0 && <div className="muted">No errors saved yet.</div>}
        {errors.map(e=> (
          <div key={e.id} style={{padding:8, borderBottom:'1px solid #eee'}}>
            <div><b>{e.type}</b> — {e.level || 'N/A'} • <span className="muted">Attempts: {e.count}</span></div>
            <div style={{marginTop:6}}>Prompt: <b>{e.prompt}</b></div>
            <div style={{marginTop:4}}>Expected: <i>{e.expected}</i></div>
            <div style={{marginTop:6}}><button onClick={()=>{ markCorrected(e.id); refresh(); }}>Mark corrected (remove)</button></div>
          </div>
        ))}
      </div>
      <div style={{marginTop:12}}>
        <button onClick={()=>{ clearAllErrors(); setErrors([]); }}>Clear all errors</button>
      </div>
    </div>
  )
}
