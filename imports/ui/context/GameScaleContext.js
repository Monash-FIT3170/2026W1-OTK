import { createContext, useContext } from 'react';

export const GameScaleContext = createContext(null);

export function useGameScale() {
  return useContext(GameScaleContext);
}
