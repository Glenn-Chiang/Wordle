import React, { createContext } from 'react';
import { GameState } from './types';

export type Position = [number, number];
export interface CursorState {
  cursor: Position;
  setCursor: React.Dispatch<React.SetStateAction<Position>>;
}
const CursorContext = createContext<CursorState | undefined>(undefined);

const GameStateContext = createContext<GameState>('ongoing')

export { CursorContext, GameStateContext as WonContext };
