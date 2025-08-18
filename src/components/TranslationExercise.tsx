import React, { useEffect, useMemo, useState } from 'react';
import { useLevel } from '@/contexts/LevelContext';
import { getTranslations } from '@/services/datasetLoader';

function normalize(s?: string) { return (s || '').toLowerCase().trim(); }

// build flat pairs from dataset (supports objects or strings)
function buildPairs(list: any[]): { en: string; it: string }[] {
  const out: { en: string; it: string }[] = [];
  for (const it of list || []) {
    if (!it) continue;
    if (typeof it === 'string') {
      // if string only, push as en with empty it
      out.push({ en: it, it: '' });
    } else {
      // try common shapes
      const en = it.en || it.eng || it.word || it.text || '';
      const ital = it.it || it.ita || it.translation || '';
      out.push({ en, it: ital });
    }
  }
  return out.filter(p => p.en || p.it);
}

export default function TranslationExercise(): JSX.Element {
  const { level } = useLevel();
  const translations = useMemo(() => getTranslations(level), [level]);

  const pairs = useMemo(() => {
    const verbs = buildPairs(translations.verbs || []);
    const nouns = buildPairs(translations.nouns || []);
    const adjs = buildPairs(translations.adjectives || []);
    return [...verbs, ...nouns, ...adjs].filter(Boolean);
  }, [translations]);

  const adaptive = level === 'Adaptive';
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<'eng-ita'|'ita-eng'>('eng-ita');
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<'correct'|'wrong'|null>(null);

  useEffect(() => {
    setIndex(0);
    setInput('');
    setChecked(false);
    setResult(null);
  }, [level, dir]);

  if (!pairs.length) return <div style={{ padding: 12 }}>Nessun esercizio disponibile per questo livello.</div>;

  // choose item: if adaptive pick random between A1/A2 via datasetLoader already, but here just cycle
  const item = pairs[index % pairs.length];

  const prompt = dir === 'eng-ita' ? item.en : item.it;
  const correct = dir === 'eng-ita' ? item.it : item.en;

  function onCheck() {
    const ok = normalize(input) === normalize(correct);
    setChecked(true);
    setResult(ok ? 'correct' : 'wrong');
  }
  function onNext() {
    setIndex(i => i + 1);
    setInput('');
    setChecked(false);
    setResult(null);
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 12 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ fontSize: 13, opacity: 0.8 }}>Translation — livello: {level}</div>
        <label style={{ marginLeft: 8 }}><input type="radio" checked={dir === 'eng-ita'} onChange={() => setDir('eng-ita')} /> ENG → ITA</label>
        <label style={{ marginLeft: 8 }}><input type="radio" checked={dir === 'ita-eng'} onChange={() => setDir('ita-eng')} /> ITA → ENG</label>
        <div style={{ marginLeft: 'auto', fontSize: 13, opacity: 0.8 }}>{`Item ${index % pairs.length + 1} / ${pairs.length}`}</div>
      </div>

      <div style={{ marginTop: 12, padding: 12, border: '1px solid #eee', borderRadius: 6 }}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>{prompt || '—'}</div>

        <div style={{ marginTop: 12 }}>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Inserisci la traduzione" style={{ width: '100%', padding: 8 }} disabled={checked} />
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button onClick={onCheck} disabled={checked || input.trim() === ''}>Check</button>
          <button onClick={onNext}>Next</button>
          <div style={{ marginLeft: 'auto', fontSize: 13, opacity: 0.8 }}>
            {checked ? (result === 'correct' ? 'Corretto ✅' : `Sbagliato — risposta: ${correct}`) : ''}
          </div>
        </div>
      </div>
    </div>
  );
}