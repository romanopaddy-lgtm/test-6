// AUTO-GENERATED in Step 6 integration
// EN-only phrasal verbs dataset (reverse-meaning multi-select). No IT translations here.

export type Level = 'A1'|'A2'|'B1'|'B2'|'C1'|'C2';

export interface PhrasalVerbItem {
  id: string;
  verb: string;          // e.g., "look up"
  meanings: string[];    // English definitions
  correct: number[];     // indexes of valid meanings (for forward mode, not used here)
  example?: string;
  level: Level;
}

export const PHRASALS_A1: PhrasalVerbItem[] = [
  { id: 'pv-a1-01', verb: 'wake up', meanings: ['stop sleeping', 'raise prices', 'put on make-up'], correct: [0], example: 'I wake up at 7 a.m.', level: 'A1' },
  { id: 'pv-a1-02', verb: 'turn on', meanings: ['start a device', 'change direction', 'turn off'], correct: [0], example: 'Turn on the light, please.', level: 'A1' },
  { id: 'pv-a1-03', verb: 'turn off', meanings: ['stop a device', 'start a device', 'leave'], correct: [0], example: 'Turn off the TV.', level: 'A1' },
  { id: 'pv-a1-04', verb: 'pick up', meanings: ['collect/lift', 'choose', 'leave behind'], correct: [0], example: 'Pick up the phone.', level: 'A1' },
  { id: 'pv-a1-05', verb: 'look for', meanings: ['try to find', 'watch', 'prepare'], correct: [0], example: 'I am looking for my keys.', level: 'A1' },
  { id: 'pv-a1-06', verb: 'put on', meanings: ['wear', 'put away', 'stand up'], correct: [0], example: 'Put on your coat.', level: 'A1' },
  { id: 'pv-a1-07', verb: 'take off', meanings: ['remove/depart (plane)', 'take a break', 'replace'], correct: [0], example: 'Take off your shoes. The plane takes off at 9.', level: 'A1' },
  { id: 'pv-a1-08', verb: 'look after', meanings: ['take care of', 'look later', 'get angry'], correct: [0], example: 'She looks after her little brother.', level: 'A1' },
  { id: 'pv-a1-09', verb: 'give up', meanings: ['stop trying', 'give around', 'give up (to police)'], correct: [0], example: 'Don’t give up!', level: 'A1' },
  { id: 'pv-a1-10', verb: 'go out', meanings: ['leave home for social activities', 'become unfashionable', 'enter a place'], correct: [0,1], example: 'We go out on Fridays.', level: 'A1' },
];

export const PHRASALS_ALL: PhrasalVerbItem[] = [...PHRASALS_A1];
