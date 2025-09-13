import React, { useState } from 'react';
import { register, login, logout, currentUser } from '@/services/authService';

export default function AuthPage(){
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string|null>(null);
  const [user, setUser] = useState(() => currentUser());

  async function onSubmit(e: React.FormEvent){
    e.preventDefault();
    setMsg(null);
    try {
      if (mode === 'register') {
        if (!username || !email || !password) throw new Error('Compila username, email e password');
        await register(username, email, password);
        setMsg('Registrazione avvenuta con successo. Sei loggato.');
      } else {
        if (!email || !password) throw new Error('Inserisci email e password');
        await login(email, password);
        setMsg('Accesso consentito.');
      }
      setUser(currentUser());
      setUsername(''); setEmail(''); setPassword('');
    } catch (err: any) {
      setMsg(err?.message || 'Errore');
    }
  }

  function doLogout(){
    logout();
    setUser(null);
    setMsg('Logout eseguito.');
  }

  return (
    <div className="card">
      <h3>Auth</h3>

      {user ? (
        <div>
          <div>Signed in as <b>{user.username}</b> {user.email ? `(${user.email})` : null}</div>
          <div style={{marginTop:8}}>
            <button onClick={doLogout}>Logout</button>
          </div>
          {msg && <div style={{marginTop:8}}>{msg}</div>}
        </div>
      ) : (
        <form onSubmit={onSubmit}>
          <div style={{display:'flex', gap:8, marginBottom:12}}>
            <button type="button" onClick={() => setMode('login')} style={{padding:'6px 12px', background: mode==='login' ? '#ddd' : 'transparent'}}>Login</button>
            <button type="button" onClick={() => setMode('register')} style={{padding:'6px 12px', background: mode==='register' ? '#ddd' : 'transparent'}}>Register</button>
          </div>

          {mode === 'register' && (
            <div style={{marginBottom:8}}>
              <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
            </div>
          )}

          <div style={{marginBottom:8}}>
            <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>

          <div style={{marginBottom:8}}>
            <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>

          <div>
            <button type="submit">{mode==='login' ? 'Login' : 'Register'}</button>
          </div>

          {msg && <div style={{marginTop:8}}>{msg}</div>}
        </form>
      )}
    </div>
  );
}
