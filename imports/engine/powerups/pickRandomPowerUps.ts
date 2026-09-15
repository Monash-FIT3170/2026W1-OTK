import './DummyPowerUp';
import type { PowerUp } from './PowerUp';
import { powerUpRegistry } from './PowerUpRegistry';

// Picks `count` power-ups to offer on the stage-clear screen. Cycles through
// the registered pool as many times as needed - with only a handful of
// power-ups registered so far, offering 3 choices means repeats are expected.
export function pickRandomPowerUps(count = 3): PowerUp[] {
  const pool = powerUpRegistry.allIds();
  if (pool.length === 0) return [];

  const ids: string[] = [];
  while (ids.length < count) {
    ids.push(...[...pool].sort(() => Math.random() - 0.5));
  }
  return ids.slice(0, count).map((id) => powerUpRegistry.create(id));
}
