/**
 * Destroy 2 cards from your hand and the next offensive card will do double the damage
 */

import { Card } from './Card';
import { GameEngine } from '../GameEngine';

export class DoubleSacrifice extends Card {
  constructor(uniqueId?: string) {
    super({
      cardId: 'double-sacrifice',
      uniqueId,
      name: 'Double Sacrifice',
      description:
        'Destroy 2 cards from your hand, buff an offensive card to deal double damage.',
      baseCost: 1,
      currentCost: 1,
      cardAmountToSelect: { min: 3, max: 3 },
    });
  }

  execute(engine: GameEngine, targetCardIndexes?: string[]): void {
    if (!targetCardIndexes || targetCardIndexes.length !== 3) return;

    const [sacrificeId1, sacrificeId2, buffTargetId] = targetCardIndexes;

    engine.removeFromHand(sacrificeId1);
    engine.removeFromHand(sacrificeId2);

    const buffTarget = engine.hand.find((c) => c.uniqueId === buffTargetId);
    if (buffTarget && buffTarget.currentAttack !== undefined) {
      buffTarget.currentAttack *= 2;
    }
  }
}
