import { storage } from '@/lib/storage';

export type Progress = {
  level: 'A1'|'A2'|'B1'|'B2'|'C1'|'C2',
  xp: number,
  streak: number,
  achievements: string[]
};

const KEY = 'progress';

export function getProgress(): Progress {
  return storage.get<Progress>(KEY, { level: 'A2', xp: 0, streak: 0, achievements: [] });
}

export function addXP(amount: number){
  const p = getProgress();
  p.xp += Math.max(0, amount|0);
  storage.set(KEY, p);
}

export function setLevel(level: Progress['level']){
  const p = getProgress();
  p.level = level;
  storage.set(KEY, p);
}

export function pushAchievement(id: string){
  const p = getProgress();
  if (!p.achievements.includes(id)) p.achievements.push(id);
  storage.set(KEY, p);
}
