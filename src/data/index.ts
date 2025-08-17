// re-export dei moduli esistenti
export * from './translationsA1';
export * from './phrasalVerbsA2';
export * from './idiomsA2';
export * from './translationsA2'; // esporta anche flipPairs e le liste A2 se servono

// import espliciti usati qui per costruire getTranslationItems
import { translationsA1 } from './translationsA1';
import { A2_ADJECTIVES, A2_VERBS, A2_NOUNS } from './translationsA2';

export type TranslationSubcategory = 'adjectives' | 'verbs' | 'nouns';

export type TranslationItem = {
  id?: string;
  level: 'A1' | 'A2' | string;
  category: 'translations';
  subcategory: TranslationSubcategory;
  en: string;
  it: string;
};

/**
 * Restituisce un array di TranslationItem per il livello richiesto.
 * - 'A1' → usa translationsA1 (già strutturato)
 * - 'A2' → costruisce gli item a partire dalle liste A2_*
 */
export function getTranslationItems(level: string | number): TranslationItem[] {
  const key = String(level).toUpperCase();

  if (key === 'A1') {
    // translationsA1 è già un array con gli attributi richiesti
    return translationsA1 as TranslationItem[];
  }

  if (key === 'A2') {
    // helper per creare id e mappare le coppie A2
    const make = (list: { en: string; it: string }[], sub: TranslationSubcategory, prefix: string) =>
      list.map((p, i) => ({
        id: `${prefix}-${String(i + 1).padStart(3, '0')}`,
        level: 'A2',
        category: 'translations' as const,
        subcategory: sub,
        en: p.en,
        it: p.it,
      }));

    return [
      ...make(A2_ADJECTIVES, 'adjectives', 'a2-tr-adj'),
      ...make(A2_VERBS, 'verbs', 'a2-tr-v'),
      ...make(A2_NOUNS, 'nouns', 'a2-tr-n'),
    ];
  }

  // fallback: A1
  return translationsA1 as TranslationItem[];
}