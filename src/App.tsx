import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Index from './pages/Index'
import TranslationsA1 from './pages/TranslationsA1'
import Translations from './pages/Translations'
import Errors from './pages/Errors'
import RewriteErrors from './pages/RewriteErrors'
import Conjugations from './pages/Conjugations'
import Auth from './pages/Auth'
import PhrasalVerbs from './pages/PhrasalVerbs';
import VoiceSettings from './pages/VoiceSettings';
import Synonyms from './pages/Synonyms';
import TranslationsA2 from './pages/TranslationsA2';
import PhrasalsA2 from './pages/PhrasalsA2';

export default function App(){
  return (
    <div className="container">
      <header style={{marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1 style={{margin:0}}>Panda — Step 1 (Translations A1)</h1>
        <nav><Link to="/">Home</Link> {' | '} <Link to="/translations/a1">Translations A1</Link></nav>
      </header>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/translations/a1" element={<TranslationsA1 />} />
              <Route path="/translations" element={<Translations />} />
              <Route path="/errors" element={<Errors />} />
        <Route path="/errors/rewrite" element={<RewriteErrors />} />
              <Route path="/conjugations" element={<Conjugations />} />
              <Route path="/auth" element={<Auth />} />
        <Route path="/phrasal-verbs" element={<PhrasalVerbs />} />
  <Route path="/voice-settings" element={<VoiceSettings />} />
  <Route path="/synonyms" element={<Synonyms />} />
  <Route path="/translations/a2" element={<TranslationsA2 />} />
  <Route path="/phrasals/a2" element={<PhrasalsA2 />} />
</Routes>
    </div>
  )
}