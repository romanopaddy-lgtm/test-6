import React, { useEffect, useState } from 'react';

const DEFAULT = { lang: 'en-GB', rate: 1, pitch: 1, volume: 1 };

export default function VoiceSettings(){ 
  const [lang, setLang] = useState(DEFAULT.lang);
  const [rate, setRate] = useState(DEFAULT.rate);
  const [pitch, setPitch] = useState(DEFAULT.pitch);
  const [volume, setVolume] = useState(DEFAULT.volume);

  useEffect(()=>{
    try{
      const raw = localStorage.getItem('panda.voice.opts');
      if(raw){
        const o = JSON.parse(raw);
        setLang(o.lang||DEFAULT.lang);
        setRate(o.rate||DEFAULT.rate);
        setPitch(o.pitch||DEFAULT.pitch);
        setVolume(o.volume||DEFAULT.volume);
      }
    }catch(e){}
  },[]);

  const save = ()=>{
    const o = { lang, rate: Number(rate), pitch: Number(pitch), volume: Number(volume) };
    localStorage.setItem('panda.voice.opts', JSON.stringify(o));
    alert('Saved voice settings. They will be used for future pronunciations.');
  };

  return (
    <div style={{maxWidth:720, margin:'0 auto', padding:16}}>
      <h2>Voice Settings</h2>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        <label>Accent<select value={lang} onChange={e=>setLang(e.target.value)}><option value='en-GB'>English (UK)</option><option value='en-US'>English (US)</option><option value='it-IT'>Italiano</option></select></label>
        <label>Rate<input type='range' min='0.6' max='1.6' step='0.1' value={rate} onChange={e=>setRate(e.target.value)} /></label>
        <label>Pitch<input type='range' min='0.5' max='2' step='0.1' value={pitch} onChange={e=>setPitch(e.target.value)} /></label>
        <label>Volume<input type='range' min='0.1' max='1.2' step='0.1' value={volume} onChange={e=>setVolume(e.target.value)} /></label>
      </div>
      <div style={{marginTop:12}}><button onClick={save} style={{padding:'8px 12px'}}>Save</button></div>
    </div>
  );
}
