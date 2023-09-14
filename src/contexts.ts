import { createContext } from 'react';

const WordsContext = createContext<WordsState | undefined>(undefined);
interface WordsState {
  words: string[][];
  setWords: React.Dispatch<React.SetStateAction<string[][]>>;
}

export type Position = [number, number];
export interface CursorState {
  cursor: Position;
  setCursor: React.Dispatch<React.SetStateAction<Position>>;
}
const CursorContext = createContext<CursorState | undefined>(undefined);

export { WordsContext, CursorContext };
