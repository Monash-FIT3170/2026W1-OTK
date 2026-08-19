/**
 * AirKnife.ts
 * Playable card that is created by the Divide and Conquer card. It deals 4 damage 
 * to the enemy.
*/

// importing components
import { Card, cardData } from './Card';
import { GameEngine } from '../GameEngine';
import { DamageEffect } from '../effect/DamageEffect';
import { cardRegistry } from './CardRegistry';

export class AirKnife extends Card {
  constructor(data?: Partial<cardData>) {
    super({
      cardId: 'air-knife',
      name: 'Air Knife',
      description: 'Deal 8 damage.',
      baseCost: 0,
      currentCost: 0,
      baseAttack: 8,
      currentAttack: 8,
      maxCopies: 2,
      ...data
    });
  }

  // executes card effects
  execute(engine: GameEngine): void {
    new DamageEffect(this.currentAttack).resolve(engine);
  }
}

cardRegistry.register('air-knife', AirKnife);
