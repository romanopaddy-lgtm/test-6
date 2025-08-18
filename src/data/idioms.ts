export type IdiomItem = {
  idiom?: string;
  phrase?: string;
  meaning?: string;
  level?: string;
  [k: string]: any;
};

export const IDIOMS_A1: IdiomItem[] = [
  { idiom: "break the ice", meaning: "to make people feel more comfortable", level: "A1" },
  { idiom: "on top of the world", meaning: "very happy", level: "A1" },
  { idiom: "a piece of cake", meaning: "very easy", level: "A1" },
  { idiom: "hit the books", meaning: "to study hard", level: "A1" },
  { idiom: "call it a day", meaning: "to stop working for the day", level: "A1" },
  { idiom: "get cold feet", meaning: "to become nervous or have second thoughts", level: "A1" },
  { idiom: "keep an eye on", meaning: "to watch someone or something", level: "A1" },
  { idiom: "ran out of", meaning: "to have none left", level: "A1" }
];

export default IDIOMS_A1;