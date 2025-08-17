const VERSION = 1;
const PREFIX = 'eng-panda';

function k(key: string){ return `${PREFIX}:v${VERSION}:${key}`; }

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(k(key));
      return raw ? JSON.parse(raw) as T : fallback;
    } catch { return fallback; }
  },
  set<T>(key: string, value: T){
    try { localStorage.setItem(k(key), JSON.stringify(value)); } catch {}
  },
  remove(key: string){
    try { localStorage.removeItem(k(key)); } catch {}
  }
};
