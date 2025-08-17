// Robust Web Speech API hook
import { useCallback, useEffect, useRef, useState } from 'react';

interface SpeakOpts {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

function getSavedOpts(): SpeakOpts {
  try {
    const raw = localStorage.getItem('panda.voice.opts');
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) { return {}; }
}

export function useVoice() {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const queueRef = useRef<SpeechSynthesisUtterance[]>([]);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

  useEffect(() => {
    if (!isSupported) return;
    const synth = window.speechSynthesis;
    synthRef.current = synth;
    const load = () => setVoices(synth.getVoices ? synth.getVoices() : []);
    load();
    if (synth.onvoiceschanged !== undefined) {
      synth.addEventListener('voiceschanged', load);
      return () => synth.removeEventListener('voiceschanged', load);
    }
  }, [isSupported]);

  const findVoice = useCallback((lang?: string) => {
    const opts = getSavedOpts();
    const langPref = lang || opts.lang || (import.meta.env.VITE_VOICE_ACCENT === 'uk' ? 'en-GB' : 'en-US');
    const v = voices.find(vv => vv.lang === langPref);
    if (v) return v;
    const anyEn = voices.find(vv => vv.lang && vv.lang.startsWith('en'));
    return anyEn || null;
  }, [voices]);

  const speak = useCallback((text: string, opts?: SpeakOpts) => {
    if (!isSupported || !synthRef.current) return Promise.resolve();
    const saved = getSavedOpts();
    const merged = { ...saved, ...opts };
    return new Promise<void>((resolve) => {
      try {
        const u = new SpeechSynthesisUtterance(String(text));
        u.lang = merged.lang || (import.meta.env.VITE_VOICE_ACCENT === 'uk' ? 'en-GB' : 'en-US');
        u.rate = merged.rate ?? 1;
        u.pitch = merged.pitch ?? 1;
        u.volume = merged.volume ?? 1;
        const v = findVoice(u.lang);
        if (v) u.voice = v;
        u.onend = () => resolve();
        u.onerror = () => resolve();
        // If not currently speaking and queue empty, speak immediately
        if (!synthRef.current.speaking && queueRef.current.length === 0) {
          synthRef.current.speak(u);
        } else {
          queueRef.current.push(u);
          // attempt to flush after small delay
          setTimeout(() => {
            try {
              if (!synthRef.current) return;
              if (!synthRef.current.speaking && queueRef.current.length > 0) {
                const next = queueRef.current.shift();
                if (next) synthRef.current.speak(next);
              }
            } catch (e) {}
          }, 200);
        }
      } catch (e) { resolve(); }
    });
  }, [isSupported, findVoice]);

  const speakMultiple = useCallback(async (items: string[], opts?: SpeakOpts) => {
    for (const t of items) {
      // eslint-disable-next-line no-await-in-loop
      await speak(t, opts);
      // small pause
      // eslint-disable-next-line no-await-in-loop
      await new Promise(res => setTimeout(res, 250));
    }
  }, [speak]);

  const stop = useCallback(() => {
    if (!isSupported || !synthRef.current) return;
    try {
      queueRef.current = [];
      synthRef.current.cancel();
    } catch (e) {}
  }, [isSupported]);

  return { isSupported, voices, speak, speakMultiple, stop };
}
