// IceCube.ts

import { Enemy } from '../Enemy';
import { enemyRegistry } from '../EnemyRegistry';
import { debuffRegistry } from '../../debuffs';

export class IceCube extends Enemy {
  static enemyId = 'icecube';

  constructor(
    data: {
      name?: string;
      health?: number;
      currentHealth?: number;
      debuffs?: string[];
      entryAnimation?: string;
      hitAnimation?: string;
    } = {}
  ) {
    const health = data.health ?? 120;
    super({
      enemyId: IceCube.enemyId,
      name: data.name ?? 'Ice Cube',
      health,
      currentHealth: data.currentHealth ?? health,
      debuffs: data.debuffs ?? [],
      entryAnimation: data.entryAnimation ?? 'spin',
      hitAnimation: data.hitAnimation ?? 'squish',
    });

    // Freeze debuff is added to all ice cubes
    if (data.debuffs === undefined) {
      debuffRegistry.create('freeze').applyTo(this);
    }
  }
}

enemyRegistry.register('icecube', IceCube);
