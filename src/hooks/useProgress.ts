import { useEffect, useState } from 'react';
import { getProgress, saveProgress, Progress } from '../services/progressService';

export function useProgress(){ 
  const [progress, setProgress] = useState<Progress>({ xp:0, streak:0, achievements:[], level:'A1' });
  const useMock = import.meta.env.VITE_USE_MOCK !== 'false';

  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      const p = await getProgress(useMock);
      if(mounted) setProgress(p);
    })();
    return ()=>{ mounted = false; }
  }, []);

  const persist = async (p: Progress)=>{ setProgress(p); try{ await saveProgress(p, useMock); }catch{} };

  const addXP = async (amount: number)=>{
    const p = {...progress, xp: (progress.xp||0)+amount};
    await persist(p);
  };
  const addAchievement = async (id: string)=>{
    const a = Array.from(new Set([...(progress.achievements||[]), id]));
    const p = {...progress, achievements: a};
    await persist(p);
  };
  const setLevel = async (level: string)=>{
    const p = {...progress, level};
    await persist(p);
  };
  const reset = async ()=>{ const p = { xp:0, streak:0, achievements:[], level:'A1' }; await persist(p); };

  return { progress, addXP, addAchievement, setLevel, reset };
}
