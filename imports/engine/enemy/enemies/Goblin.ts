// Goblin.ts

// importing components
import { Enemy } from "../Enemy";
import { enemyRegistry } from "../EnemyRegistry";

export class Goblin extends Enemy {

  static enemyId = 'goblin';
  static entryAnimation = 'drop';
  static hitAnimation = 'squish';

  // constructs enemy
  constructor(data: { name?: string; health?: number; currentHealth?: number; debuffs?: string[] } = {}) {
    const health = data.health ?? 20;
    super({
      enemyId: Goblin.enemyId,
      name: data.name ?? 'Goblin',
      health,
      currentHealth: data.currentHealth ?? health,
      debuffs: data.debuffs ?? [],
    });
  }

}

enemyRegistry.register('goblin', new Goblin().toJSON());
