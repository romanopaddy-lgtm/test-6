import React, { useState } from 'react';
import { getSupabaseClient } from '../services/supabaseClient';

export default function AuthPage(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const isMock = import.meta.env.VITE_USE_MOCK !== 'false';

  const onMockLogin = ()=>{
    const user = { id: 'local_' + Math.random().toString(36).slice(2,9), email };
    try{ localStorage.setItem('panda_user', JSON.stringify(user)); setMsg('Mock login successful'); window.location.href='/'; }catch(e){ setMsg('Error saving user'); }
  };

  const onSupabaseLogin = async ()=>{
    const supabase = getSupabaseClient();
    if(!supabase){ setMsg('Supabase not configured'); return; }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if(error) setMsg('Login error: ' + error.message);
    else { setMsg('Logged in'); window.location.href='/'; }
  };

  const onSubmit = (e:any)=>{ e.preventDefault(); if(isMock) onMockLogin(); else onSupabaseLogin(); };

  return (
    <div className="card">
      <h3>Login / Register</h3>
      <form onSubmit={onSubmit}>
        <div style={{marginTop:8}}><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div style={{marginTop:8}}><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <div style={{marginTop:8}}><button type="submit">Sign in / Register</button></div>
      </form>
      {msg && <div style={{marginTop:8}}>{msg}</div>}
    </div>
  )
}
