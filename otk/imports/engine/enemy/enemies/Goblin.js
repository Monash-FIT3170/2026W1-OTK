import { Enemy } from '../Enemy.js';

export class Goblin extends Enemy {
  static enemyId = 'goblin';
  static entryAnimation = 'drop';
  static hitAnimation = 'squish';

  constructor(data = {}) {
    super({
      enemyId: Goblin.enemyId,
      name: data.name ?? 'Goblin',
      health: data.health ?? 20,
      debuffs: data.debuffs ?? [],
    });
  }
}