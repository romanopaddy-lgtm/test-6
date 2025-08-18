import React, { useEffect, useMemo, useState } from 'react';
import { useLevel } from '@/contexts/LevelContext';

function normalize(s?: string) { return (s || '').toLowerCase().trim(); }

// Lists provided by you (A2 and A1). Keys are lemma -> array of acceptable synonyms.
const SYN_A2: Record<string, string[]> = {
  able: ['capable','competent','skilled','fit'],
  afraid: ['scared','frightened','nervous','anxious','fearful'],
  aged: ['old','elderly','senior','ancient'],
  amazing: ['wonderful','incredible','fantastic','awesome'],
  amazed: ['surprised','astonished','shocked','stunned'],
  angry: ['mad','annoyed','furious','irritated'],
  attractive: ['pretty','beautiful','good-looking','lovely'],
  available: ['free','accessible','ready','obtainable'],
  awesome: ['amazing','incredible','wonderful','fantastic'],
  awful: ['terrible','horrible','dreadful','unpleasant'],
  bad: ['terrible','awful','poor','nasty'],
  bored: ['uninterested','tired','weary','fed up'],
  boring: ['dull','uninteresting','tiring','tedious'],
  clean: ['neat','tidy','fresh','spotless'],
  clever: ['smart','intelligent','bright','sharp'],
  crazy: ['mad','insane','silly','wild'],
  dead: ['lifeless','gone','passed away','without life'],
  different: ['unlike','distinct','separate','varied'],
  dry: ['arid','parched','thirsty','barren'],
  early: ['first','initial','premature','prior'],
  easy: ['simple','clear','effortless','straightforward'],
  electric: ['powered','electrical','charged','plugged-in'],
  fair: ['just','right','honest','reasonable'],
  famous: ['well-known','popular','celebrated','noted'],
  fantastic: ['great','wonderful','amazing','fabulous'],
  fat: ['overweight','heavy','plump','large'],
  friendly: ['kind','helpful','pleasant','nice'],
  full: ['complete','packed','entire','whole'],
  glad: ['happy','pleased','delighted','joyful'],
  good: ['nice','fine','great','pleasant'],
  great: ['excellent','fantastic','wonderful','super'],
  happy: ['glad','pleased','joyful','cheerful'],
  heavy: ['weighty','huge','massive','big'],
  horrible: ['awful','terrible','dreadful','nasty'],
  hot: ['warm','boiling','burning','heated'],
  huge: ['big','enormous','giant','massive'],
  hungry: ['starving','empty','peckish','famished'],
  last: ['final','end','ultimate','concluding'],
  late: ['delayed','overdue','belated','tardy'],
  lazy: ['idle','inactive','sluggish','slow'],
  large: ['big','huge','enormous','great'],
  latest: ['newest','recent','up-to-date','fresh'],
  light: ['bright','pale','clear','shiny'],
  little: ['small','tiny','short','petite'],
  long: ['extended','tall','lengthy','big'],
  married: ['wedded','joined','united','hitched'],
  near: ['close','next to','nearby','adjacent'],
  nervous: ['anxious','worried','uneasy','fearful'],
  new: ['recent','modern','latest','fresh'],
  next: ['following','coming','subsequent','after'],
  nice: ['pleasant','kind','friendly','lovely'],
  pale: ['light','fair','faded','colorless'],
  pretty: ['beautiful','cute','lovely','attractive'],
  proud: ['pleased','glad','delighted','content'],
  quiet: ['calm','silent','peaceful','still'],
  sad: ['unhappy','sorrowful','depressed','upset'],
  safe: ['secure','protected','sheltered','sound'],
  same: ['equal','identical','similar','matching'],
  slim: ['thin','slender','lean','skinny'],
  slow: ['unhurried','sluggish','leisurely','late'],
  small: ['little','tiny','petite','mini'],
  successful: ['rich','prosperous','strong','winning'],
  sure: ['certain','confident','positive','clear'],
  surprised: ['amazed','astonished','shocked','startled'],
  thin: ['slim','skinny','lean','slender'],
  tired: ['sleepy','exhausted','weary','fatigued'],
  warm: ['hot','heated','mild','pleasant'],
  worried: ['anxious','nervous','upset','concerned'],
};

const SYN_A1: Record<string, string[]> = {
  angry: ['mad','upset','annoyed','irritated'],
  beautiful: ['pretty','lovely','attractive','cute'],
  big: ['large','huge','big-sized','oversized'],
  black: ['dark','inky','jet-black','ebony'],
  blue: ['navy','sky-blue','pale-blue','azure'],
  brown: ['tan','chocolate','beige','light-brown'],
  clean: ['tidy','neat','spotless','orderly'],
  closed: ['shut','locked','fastened','sealed'],
  cool: ['chilly','refreshing','moderate','calm'],
  correct: ['right','accurate','proper','exact'],
  dirty: ['messy','soiled','filthy','grimy'],
  double: ['twin','pair','dual','combined'],
  favourite: ['preferred','best-loved','top-choice','most liked'],
  great: ['excellent','super','great-big','fantastic'],
  happy: ['glad','joyful','cheerful','pleased'],
  hot: ['warm','boiling','heated','scorching'],
  hungry: ['peckish','starving','empty-stomached','ravenous'],
  new: ['recent','fresh','brand-new','novel'],
  nice: ['kind','pleasant','lovely','friendly'],
  old: ['aged','ancient','elderly','old-fashioned'],
  open: ['ajar','wide-open','unlocked','accessible'],
  perfect: ['ideal','flawless','spot-on','exact'],
  pink: ['pale-red','rosy','light-pink','blush'],
  purple: ['violet','lavender','plum','magenta'],
  quick: ['fast','rapid','swift','speedy'],
  quiet: ['silent','calm','peaceful','soft'],
  sad: ['unhappy','sorrowful','depressed','downcast'],
  safe: ['secure','protected','harmless','unharmed'],
  scary: ['frightening','frightful','spooky','creepy'],
  short: ['brief','small','miniature','compact'],
  slow: ['unhurried','lethargic','sluggish','delayed'],
  small: ['tiny','little','mini','compact'],
  strong: ['powerful','firm','sturdy','robust'],
  true: ['real','correct','actual','authentic'],
  ugly: ['unattractive','hideous','plain','grotesque'],
  warm: ['cozy','heated','pleasant','hotish'],
  wet: ['damp','moist','soaked','drizzly'],
  young: ['youthful','childish','juvenile','teeny'],
  wrong: ['incorrect','awry','off','unsuitable'],
  everyday: ['daily','regular','ordinary','routine'],
};

export default function SynonymsExercise(): JSX.Element {
  const { level } = useLevel();
  const adaptive = level === 'Adaptive';
  const chosenLevel = useMemo(() => {
    if (!adaptive) return level;
    return Math.random() < 0.5 ? 'A1' : 'A2';
  }, [level]);

  const pool = useMemo(() => {
    return chosenLevel === 'A2' ? Object.keys(SYN_A2) : Object.keys(SYN_A1);
  }, [chosenLevel]);

  const synonymsMap = chosenLevel === 'A2' ? SYN_A2 : SYN_A1;

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [lastResult, setLastResult] = useState<'correct'|'wrong'|null>(null);

  useEffect(() => {
    // when level/pool changes, reset
    setIndex(0);
    setInput('');
    setChecked(false);
    setLastResult(null);
  }, [chosenLevel]);

  if (!pool.length) return <div style={{ padding: 12 }}>Nessun contenuto disponibile per questo livello.</div>;

  const word = pool[index % pool.length];
  const corrects = synonymsMap[word] || [];

  function onCheck() {
    const ok = corrects.some(c => normalize(c) === normalize(input));
    setChecked(true);
    setLastResult(ok ? 'correct' : 'wrong');
  }
  function onNext() {
    setIndex(i => i + 1);
    setInput('');
    setChecked(false);
    setLastResult(null);
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 12 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ fontSize: 13, opacity: 0.8 }}>Synonyms — livello effettivo: {chosenLevel}</div>
        <div style={{ marginLeft: 'auto', fontSize: 13, opacity: 0.8 }}>
          Item {index % pool.length + 1} / {pool.length}
        </div>
      </div>

      <div style={{ marginTop: 12, padding: 12, border: '1px solid #eee', borderRadius: 6 }}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>{word}</div>

        <div style={{ marginTop: 12 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Scrivi un sinonimo in inglese"
            style={{ width: '100%', padding: 8 }}
            disabled={checked}
          />
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button onClick={onCheck} disabled={checked || input.trim() === ''}>Check</button>
          <button onClick={onNext}>Next</button>
          <div style={{ marginLeft: 'auto', fontSize: 13, opacity: 0.8 }}>
            {checked ? (lastResult === 'correct' ? 'Corretto ✅' : `Sbagliato — possibili: ${corrects.join(', ')}`) : ''}
          </div>
        </div>
      </div>
    </div>
  );
}