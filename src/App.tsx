import React from 'react';
import { LevelProvider } from '@/contexts/LevelContext';
import LevelSelector from '@/components/LevelSelector';

import { Routes, Route, Link } from 'react-router-dom';
import Index from './pages/Index';
import TranslationsA1 from './pages/TranslationsA1';
import TranslationsA2 from './pages/TranslationsA2';
import Translations from './pages/Translations';
import Errors from './pages/Errors';
import RewriteErrors from './pages/RewriteErrors';
import Conjugations from './pages/Conjugations';
import PhrasalVerbs from './pages/PhrasalVerbs';
import PhrasalsA2 from './pages/PhrasalsA2';
import Synonyms from './pages/Synonyms';
import VoiceSettings from './pages/VoiceSettings';
import IdiomsA2 from './pages/IdiomsA2';

export default function App(): JSX.Element {
  return (
    <LevelProvider>
      <header style={{ padding: 12, borderBottom: '1px solid #eee' }}>
        <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
            <Link to="/">Home</Link>
            <Link to="/translations-a1">Translations A1</Link>
            <Link to="/translations-a2">Translations A2</Link>
            <Link to="/translations">Translations (All)</Link>
            <Link to="/idioms-a2">Idioms A2</Link>
            <Link to="/errors">Errors</Link>
            <Link to="/rewrite-errors">Rewrite Errors</Link>
            <Link to="/conjugations">Conjugations</Link>
            <Link to="/phrasal-verbs">Phrasal Verbs</Link>
            <Link to="/phrasals-a2">Phrasals A2</Link>
            <Link to="/synonyms">Synonyms</Link>
            <Link to="/voice-settings">Voice Settings</Link>
          </div>
          <div style={{marginLeft:12}}><LevelSelector /></div>
        </nav>
      </header>

      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/translations-a1" element={<TranslationsA1 />} />
          <Route path="/translations-a2" element={<TranslationsA2 />} />
          <Route path="/translations" element={<Translations />} />
          <Route path="/idioms-a2" element={<IdiomsA2 />} />
          <Route path="/errors" element={<Errors />} />
          <Route path="/rewrite-errors" element={<RewriteErrors />} />
          <Route path="/conjugations" element={<Conjugations />} />
          <Route path="/phrasal-verbs" element={<PhrasalVerbs />} />
          <Route path="/phrasals-a2" element={<PhrasalsA2 />} />
          <Route path="/synonyms" element={<Synonyms />} />
          <Route path="/voice-settings" element={<VoiceSettings />} />
        </Routes>
      </main>
    </LevelProvider>
  );
}