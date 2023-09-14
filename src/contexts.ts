import React, { createContext } from 'react';

const WordsContext = createContext<WordsState | undefined>(undefined);
interface WordsState {
  words: string[][];
  setWords: React.Dispatch<React.SetStateAction<string[][]>>;
}

export interface GradesState {
  grades: number[][];
  setGrades: React.Dispatch<React.SetStateAction<number[][]>>
}
const GradesContext = createContext<GradesState | undefined>(undefined)

export type Position = [number, number];
export interface CursorState {
  cursor: Position;
  setCursor: React.Dispatch<React.SetStateAction<Position>>;
}
const CursorContext = createContext<CursorState | undefined>(undefined);


export { WordsContext, GradesContext, CursorContext };
