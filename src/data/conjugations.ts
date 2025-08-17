// Conjugations utility and dataset (improved)
export type Tense = 'Present Simple' | 'Past Simple' | 'Present Continuous' | 'Future Simple';
export type Pronoun = 'I'|'You'|'He'|'She'|'It'|'We'|'They';

export const IRREGULARS: Record<string, { past: string; pastPart?: string; present3?: string }> = {
  'be': { past: 'was/were', pastPart: 'been', present3: 'is' },
  'have': { past: 'had', pastPart: 'had', present3: 'has' },
  'do': { past: 'did', pastPart: 'done', present3: 'does' },
  'go': { past: 'went', pastPart: 'gone', present3: 'goes' },
  'eat': { past: 'ate', pastPart: 'eaten', present3: 'eats' },
  'see': { past: 'saw', pastPart: 'seen', present3: 'sees' },
  'come': { past: 'came', pastPart: 'come', present3: 'comes' },
  'take': { past: 'took', pastPart: 'taken', present3: 'takes' },
  'make': { past: 'made', pastPart: 'made', present3: 'makes' },
  'get': { past: 'got', pastPart: 'gotten', present3: 'gets' },
  'give': { past: 'gave', pastPart: 'given', present3: 'gives' },
  'read': { past: 'read', pastPart: 'read', present3: 'reads' },
  'write': { past: 'wrote', pastPart: 'written', present3: 'writes' },
  'run': { past: 'ran', pastPart: 'run', present3: 'runs' },
  'buy': { past: 'bought', pastPart: 'bought', present3: 'buys' },
  'teach': { past: 'taught', pastPart: 'taught', present3: 'teaches' },
  'think': { past: 'thought', pastPart: 'thought', present3: 'thinks' },
  'sleep': { past: 'slept', pastPart: 'slept', present3: 'sleeps' },
  'bring': { past: 'brought', pastPart: 'brought', present3: 'brings' },
  'build': { past: 'built', pastPart: 'built', present3: 'builds' },
  'catch': { past: 'caught', pastPart: 'caught', present3: 'catches' },
  'choose': { past: 'chose', pastPart: 'chosen', present3: 'chooses' },
};

// Basic verbs dataset (A1/A2 sample)
export const VERBS = [
  'be','have','do','go','eat','see','come','take','make','get','give','read','write','run','buy','teach','think','sleep','bring','build'
] as const;

function isVowel(ch: string){ return 'aeiou'.includes(ch); }

// helper to create gerund
function toGerund(base: string){
  if(base.endsWith('ie')) return base.slice(0,-2) + 'ying';
  if(base.endsWith('e') && base !== 'be') return base.slice(0,-1) + 'ing';
  // double consonant for short CVC (simple heuristic)
  if(base.length>=3 && !isVowel(base[base.length-1]) && isVowel(base[base.length-2]) && !isVowel(base[base.length-3])){
    return base + base[base.length-1] + 'ing';
  }
  return base + 'ing';
}

// helper for third person singular
function toThirdPerson(base: string){
  if(IRREGULARS[base] && IRREGULARS[base].present3) return IRREGULARS[base].present3;
  if(base.endsWith('y') && !isVowel(base[base.length-2])) return base.slice(0,-1) + 'ies';
  if(base.endsWith('s') || base.endsWith('sh') || base.endsWith('ch') || base.endsWith('x') || base.endsWith('z')) return base + 'es';
  return base + 's';
}

// helper for past simple regular
function toPastSimpleRegular(base: string){
  if(base.endsWith('e')) return base + 'd';
  if(base.endsWith('y') && !isVowel(base[base.length-2])) return base.slice(0,-1) + 'ied';
  // double consonant heuristic as above
  if(base.length>=3 && !isVowel(base[base.length-1]) && isVowel(base[base.length-2]) && !isVowel(base[base.length-3])){
    return base + base[base.length-1] + 'ed';
  }
  return base + 'ed';
}

// Main conjugate function
export function conjugate(baseVerb: string, tense: Tense, pronoun: Pronoun){
  const base = baseVerb.toLowerCase().trim();
  const irr = IRREGULARS[base];
  switch(tense){
    case 'Present Simple': {
      if(base === 'be'){
        if(pronoun === 'I') return 'am';
        if(pronoun === 'You' || pronoun === 'We' || pronoun === 'They') return 'are';
        return 'is';
      }
      if(irr && irr.present3 && (pronoun === 'He' || pronoun === 'She' || pronoun === 'It')) return irr.present3;
      if(pronoun === 'He' || pronoun === 'She' || pronoun === 'It') return toThirdPerson(base);
      return base;
    }
    case 'Past Simple': {
      if(irr) return irr.past;
      return toPastSimpleRegular(base);
    }
    case 'Present Continuous': {
      // be + gerund
      const ger = toGerund(base);
      const beForm = (pronoun === 'I') ? 'am' : (pronoun === 'He' || pronoun === 'She' || pronoun === 'It') ? 'is' : 'are';
      return beForm + ' ' + ger;
    }
    case 'Future Simple': {
      return 'will ' + base;
    }
    default: return base;
  }
}

// normalization for user input and expected answers
function normalize(s: string){ return (s||'').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/["'’]/g,'').replace(/\s+/g,' ').trim(); }

// generate accepted answers set (tolerant): handle contractions and minor variants
export function acceptedAnswers(baseVerb: string, tense: Tense, pronoun: Pronoun){
  const expected = conjugate(baseVerb, tense, pronoun);
  const out = new Set<string>();
  out.add(normalize(expected));
  // if expected contains space (e.g., 'am eating', 'will go'), also allow forms without extra spaces/punct
  out.add(normalize(expected.replace(/\s+/g,' ')));
  // allow contraction variants for 'be' + gerund or 'will'
  if(tense === 'Present Continuous'){
    // e.g., "I am eating" -> "I'm eating"
    if(pronoun === 'I') out.add(normalize(expected.replace(/^am /,'m '))); // "m eating" -> normalized 'm eating' maybe not ideal
    if(pronoun === 'You' || pronoun === 'We' || pronoun === 'They') out.add(normalize(expected.replace(/^(are )/,'re ')));
    if(pronoun === 'He' || pronoun === 'She' || pronoun === 'It') out.add(normalize(expected.replace(/^(is )/,'s ')));
  }
  if(tense === 'Future Simple'){
    // allow "I'll go" for I, "we'll" for we etc.
    const baseNorm = normalize('will ' + baseVerb);
    if(pronoun === 'I') out.add(normalize("I'll " + baseVerb));
    if(pronoun === 'You') out.add(normalize("You'll " + baseVerb));
    if(pronoun === 'He' || pronoun === 'She' || pronoun === 'It') out.add(normalize("He'll " + baseVerb));
    if(pronoun === 'We') out.add(normalize("We'll " + baseVerb));
    if(pronoun === 'They') out.add(normalize("They'll " + baseVerb));
    out.add(baseNorm);
  }
  return Array.from(out);
}
