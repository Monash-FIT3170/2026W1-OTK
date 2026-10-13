import type { GameEngine } from '../GameEngine';
import type { Enemy } from '../enemy/Enemy';
import { Debuff, type debuffData } from './Debuff';
import { debuffRegistry } from './DebuffRegistry';

export class Evasion extends Debuff {
  static readonly TRIGGER_EVERY = 3;

  constructor(data: Partial<debuffData> = {}) {
    super({
      debuffId: 'evasion',
      name: 'Evasion',
      debuffAnimation: 'dodge',
      ...data,
    });
  }

  activateDebuff(engine: GameEngine): void {}

  override modifyIncomingDamage(enemy: Enemy, amount: number): number {
    return enemy.damageTakenCount % Evasion.TRIGGER_EVERY === 0 ? 0 : amount;
  }
}

debuffRegistry.register('evasion', Evasion);
