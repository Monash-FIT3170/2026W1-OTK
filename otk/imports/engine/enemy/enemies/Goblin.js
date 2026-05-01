import { Enemy } from '../Enemy.js';

export class Goblin extends Enemy {
  static enemyId = 'goblin';

  constructor(data = {}) {
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
