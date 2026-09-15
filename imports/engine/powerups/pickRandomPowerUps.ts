import './DummyPowerUp';
import type { PowerUp } from './PowerUp';
import { powerUpRegistry } from './PowerUpRegistry';

// Picks `count` random, non-repeating power-ups from the registered pool -
// used to build the 3 choices shown on the stage-clear screen.
export function pickRandomPowerUps(count = 3): PowerUp[] {
  const ids = [...powerUpRegistry.allIds()].sort(() => Math.random() - 0.5);
  return ids.slice(0, count).map((id) => powerUpRegistry.create(id));
}
