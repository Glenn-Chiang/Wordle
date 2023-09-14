import React, { createContext } from 'react';

export type Position = [number, number];
export interface CursorState {
  cursor: Position;
  setCursor: React.Dispatch<React.SetStateAction<Position>>;
}
const CursorContext = createContext<CursorState | undefined>(undefined);

const WonContext = createContext(false)

export { CursorContext, WonContext };
