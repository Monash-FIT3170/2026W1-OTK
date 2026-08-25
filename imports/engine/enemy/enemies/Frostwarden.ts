// Frostwarden.ts
// Stage 2 boss. Carries the freeze debuff.

import { Enemy } from '../Enemy';
import { enemyRegistry } from '../EnemyRegistry';
import { EnemyData } from '../../types';
import { debuffRegistry } from '../../debuffs';

export class Frostwarden extends Enemy {
  static enemyId = 'frostwarden';

  constructor(data: Partial<EnemyData> = {}) {
    const health = data.health ?? 120;

    super({
      enemyId: Frostwarden.enemyId,
      name: data.name ?? 'Frostwarden',
      health,
      currentHealth: data.currentHealth ?? health,
      debuffs: data.debuffs ?? [],
      entryAnimation: data.entryAnimation ?? 'drop',
      hitAnimation: data.hitAnimation ?? 'squish',
      timerDebuffActive: data.timerDebuffActive,
      timerDebuffDeadline: data.timerDebuffDeadline,
      timerDebuffInterval: data.timerDebuffInterval,
      timerDebuffTickAmount: data.timerDebuffTickAmount,
    });

    // Only fresh spawns receive their default debuffs. Saved enemies restore
    // the exact debuff list provided in their serialized data.
    if (data.debuffs === undefined) {
      debuffRegistry.create('freeze').applyTo(this);
    }
  }
}

enemyRegistry.register(Frostwarden.enemyId, Frostwarden);
