import React from 'react';
import { LevelProvider } from '@/contexts/LevelContext';
import LevelSelector from '@/components/LevelSelector';

import { Routes, Route, Link } from 'react-router-dom';
import Index from './pages/Index';
import Translations from './pages/Translations';
import Errors from './pages/Errors';
import RewriteErrors from './pages/RewriteErrors';
import Conjugations from './pages/Conjugations';
import PhrasalVerbs from './pages/PhrasalVerbs';
import Synonyms from './pages/Synonyms';
import VoiceSettings from './pages/VoiceSettings';
import Idioms from './pages/Idioms';

export default function App(): JSX.Element {
  return (
    <LevelProvider>
      <header style={{ padding: 12, borderBottom: '1px solid #eee' }}>
        <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
            <Link to="/">Home</Link>
            <Link to="/translations">Translations</Link>
            <Link to="/idioms">Idioms</Link>
            <Link to="/errors">Errors</Link>
            <Link to="/rewrite-errors">Rewrite Errors</Link>
            <Link to="/conjugations">Conjugations</Link>
            <Link to="/phrasal-verbs">Phrasal Verbs</Link>
            <Link to="/synonyms">Synonyms</Link>
            <Link to="/voice-settings">Voice Settings</Link>
          </div>
          <div style={{marginLeft:12}}><LevelSelector /></div>
        </nav>
      </header>

      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/translations" element={<Translations />} />
          <Route path="/idioms" element={<Idioms />} />
          <Route path="/errors" element={<Errors />} />
          <Route path="/rewrite-errors" element={<RewriteErrors />} />
          <Route path="/conjugations" element={<Conjugations />} />
          <Route path="/phrasal-verbs" element={<PhrasalVerbs />} />
          <Route path="/synonyms" element={<Synonyms />} />
          <Route path="/voice-settings" element={<VoiceSettings />} />
        </Routes>
      </main>
    </LevelProvider>
  );
}