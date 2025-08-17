import { useMemo, useState, useEffect } from 'react';
import { useVoice } from '@/hooks/useVoice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { PHRASALS_ALL } from '@/data/phrasalVerbs';
import { evaluatePhrasalMultiSelect } from '@/exercises/phrasalMultiSelect';

type Item = typeof PHRASALS_ALL[number];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function choice<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

export default function PhrasalVerbsMultiSelect() {
  const { speak, isSupported, stop } = useVoice();
  const pool = useMemo(() => PHRASALS_ALL, []);
  // Build questions: pick 1 meaning and 6 candidate verbs (2–3 correct if possible)
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [scoreAcc, setScoreAcc] = useState(0);
  const [qCount, setQCount] = useState(0);

  const buildQuestion = (seed: number) => {
    const base = pool[seed % pool.length];
    const meaning = base.meanings[0]; // canonical meaning for A1 set
    const correctVerbs = pool.filter(p => p.meanings[0] === meaning).map(p => p.verb);
    const distractors = pool.filter(p => p.meanings[0] !== meaning).map(p => p.verb);
    const candidates = shuffle([...choice(correctVerbs, Math.min(3, correctVerbs.length || 1)), ...choice(distractors, 6)]).slice(0, 6);
    const options = candidates.map(v => ({ text: v, correct: correctVerbs.includes(v) }));
    return { meaning, options };
  };

  const q = useMemo(() => buildQuestion(qIndex), [qIndex]);

  useEffect(() => {
    if (isSupported) speak(q.meaning);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex]);

  const onToggle = (text: string) => {
    if (revealed) return;
    setSelected(s => s.includes(text) ? s.filter(x => x !== text) : [...s, text]);
  };

  const onCheck = () => {
    const result = evaluatePhrasalMultiSelect(q.options, selected);
    setRevealed(true);
    setScoreAcc(s => s + result.score);
    setQCount(n => n + 1);
    if (isSupported && result.score < 1) {
      // auto-repeat correct verbs as feedback
      const correct = q.options.filter(o => o.correct).map(o => o.text);
      let i = 0;
      const speakNext = () => {
        if (i >= correct.length) return;
        speak(correct[i]);
        i++;
        setTimeout(speakNext, 750);
      };
      speakNext();
    }
  };

  const onNext = () => {
    setSelected([]);
    setRevealed(false);
    setQIndex(i => i + 1);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Phrasal Verbs — Multi-Select (Reverse meaning)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Meanings are in English only</div>
            <Badge variant="secondary">Score avg: {qCount ? (scoreAcc / qCount).toFixed(2) : '—'}</Badge>
          </div>

          <div className="p-4 rounded-xl border bg-card">
            <div className="mb-2 text-lg flex items-center gap-2">Meaning: <button className="text-sm px-2 py-1 border rounded" onClick={()=>isSupported && speak(q.meaning)}>🔊</button></div>
            <div className="mb-4 text-base font-medium">{q.meaning}</div>
            <div className="space-y-2">
              {q.options.map(opt => (
                <label key={opt.text} className={`flex items-center gap-2 p-2 rounded-lg border ${revealed ? (opt.correct ? 'bg-green-50' : (selected.includes(opt.text) ? 'bg-red-50' : 'bg-card')) : 'bg-card'}`}>
                  <Checkbox checked={selected.includes(opt.text)} onCheckedChange={()=>onToggle(opt.text)} />
                  <span>{opt.text}</span>
                </label>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <Button onClick={onCheck} disabled={revealed}>Check</Button>
              <Button variant="outline" onClick={onNext}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
