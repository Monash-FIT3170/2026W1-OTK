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

  // Every TRIGGER_EVERY-th hit (1-based) is dodged
  static evadesHit(hitNumber: number): boolean {
    return hitNumber % Evasion.TRIGGER_EVERY === 0;
  }

  // Whether the next hit on this enemy will be dodged. Takes plain enemy
  // data so the UI can ask before the server has resolved the hit.
  static evadesNextHit(enemy: {
    debuffs?: string[];
    damageTakenCount?: number;
  }): boolean {
    return (
      (enemy.debuffs ?? []).includes('evasion') &&
      Evasion.evadesHit((enemy.damageTakenCount ?? 0) + 1)
    );
  }

  activateDebuff(engine: GameEngine): void {}

  override modifyIncomingDamage(enemy: Enemy, amount: number): number {
    return Evasion.evadesHit(enemy.damageTakenCount) ? 0 : amount;
  }
}

debuffRegistry.register('evasion', Evasion);
