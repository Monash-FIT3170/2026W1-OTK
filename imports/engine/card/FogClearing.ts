// FogClearing.ts

// importing components
import { Card, cardData } from './Card';
import { GameEngine } from '../GameEngine';
import { DamageEffect } from '../effect/DamageEffect';
import { cardRegistry } from './CardRegistry';

export class FogClearing extends Card {
  // constructs card - defaults are base values; pass saved cardData to restore mutable stats
  constructor(data?: Partial<cardData>) {
    super({
      cardId: 'fog-clearing',
      name: 'Fog Clearing',
      description: '',
      baseCost: 2,
      currentCost: 2,
      baseAttack: 12,
      currentAttack: 12,
      ...data,
    });
  }

  // executes card effects
  execute(engine: GameEngine): void {
    new DamageEffect(this.currentAttack).resolve(engine);
  }
}

cardRegistry.register('fog-clearing', FogClearing);
