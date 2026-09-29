import { ChangeCostEffect } from '../effect/ChangeCostEffect';
import type { GameEngine } from '../GameEngine';
import { Debuff, type debuffData } from './Debuff';
import { debuffRegistry } from './DebuffRegistry';

export class Inflation extends Debuff {
  static readonly TRIGGER_EVERY = 3;
  static readonly COST_INCREASE = 1;

  constructor(data: Partial<debuffData> = {}) {
    super({
      debuffId: 'inflation',
      name: 'Inflation',
      debuffAnimation: 'inflation',
      ...data,
    });
  }

  // No start-of-fight effect, as the inflation only reacts to card plays
  activateDebuff(engine: GameEngine): void {}

  executeDebuff(engine: GameEngine): void {
    if ((engine.cardsUsedThisStage + 1) % Inflation.TRIGGER_EVERY === 0) {
      new ChangeCostEffect(engine.getHand(), Inflation.COST_INCREASE).resolve(
        engine
      );
    }
  }
}

// Make Inflation available when an enemy's debuff ID is activated.
debuffRegistry.register('inflation', Inflation);
