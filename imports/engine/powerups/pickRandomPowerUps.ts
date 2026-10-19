import './DealDamagePowerUp';
import './RestartStagePowerup';
import './DuplicateCardsPowerUp';
import './StockUpPowerUp';
import type { PowerUp } from './PowerUp';
import { powerupRegistry } from './PowerupRegistry';

// Picks `count` power-ups to offer on the stage-clear screen. Cycles through
// the registered pool as many times as needed
// Can filter out any power ups, based on ID, so they won't be selected
export function pickRandomPowerUps(count = 3, filterOutPowerUps: string[] = []): PowerUp[] {
  var pool = powerupRegistry.allIds();

  // Removing any power ups that should be filtered out
  pool = pool.filter(id => !filterOutPowerUps.includes(id));

  if (pool.length === 0) return [];

  const ids: string[] = [];
  while (ids.length < count) {
    ids.push(...[...pool].sort(() => Math.random() - 0.5));
  }
  return ids.slice(0, count).map((id) => powerupRegistry.create(id));
}
