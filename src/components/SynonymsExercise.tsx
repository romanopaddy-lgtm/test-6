import React, { useEffect, useState } from 'react';
import { generateSynonyms } from '@/services/gptStub';

const SAMPLE = ['easy','big','small','happy','go','eat','see','make','take'];

export default function SynonymsExercise(){
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState('');
  const [accepted, setAccepted] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const word = SAMPLE[index % SAMPLE.length];

  useEffect(()=>{
    let mounted = true;
    generateSynonyms(word, 8).then(list => { if(mounted) setAccepted(list); });
    return ()=>{ mounted=false; }
  }, [word]);

  const check = ()=>{
    if(!value) return setMessage('Type a synonym');
    const norm = value.trim().toLowerCase();
    const ok = accepted.map(a=>a.toLowerCase()).includes(norm);
    setMessage(ok ? 'Correct!' : 'Not in list — but accepted answers are flexible (use stub suggestions)');
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="text-sm opacity-70">Synonyms — type a valid synonym (mock suggestions)</div>
      <div className="text-xl font-semibold">{word}</div>
      <input className="w-full border p-2" value={value} onChange={e=>setValue(e.target.value)} placeholder="Type synonym" />
      <div className="flex gap-2">
        <button onClick={check} className="px-3 py-2 rounded bg-emerald-600 text-white">Check</button>
        <button onClick={()=>{ setIndex(i=>i+1); setValue(''); setMessage(''); }}>Next</button>
      </div>
      {message && <div className="text-sm mt-2">{message}</div>}
      <div className="text-xs opacity-60 mt-2">(Stub suggestions: {accepted.join(', ')})</div>
    </div>
  );
}
