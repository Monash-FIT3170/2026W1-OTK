import type { GameEngine } from '../GameEngine';
import { Debuff, type debuffData } from './Debuff';
import { debuffRegistry } from './DebuffRegistry';

export class Freeze extends Debuff {
  constructor(data: Partial<debuffData> = {}) {
    super({
      debuffId: 'freeze',
      name: 'Freeze',
      debuffAnimation: 'freeze',
      ...data,
    });
  }

  activateDebuff(engine: GameEngine): void {
    const eligibleCards = engine.deck.filter((card) => !card.isFrozen);
    if (eligibleCards.length === 0) return;

    const targetIndex = Math.floor(Math.random() * eligibleCards.length);
    eligibleCards[targetIndex].isFrozen = true;
  }
}

// Make Freeze available when an enemy's debuff ID is activated.
debuffRegistry.register('freeze', Freeze);
