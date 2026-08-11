// KillingBlow.ts

// Importing components
import { Card, cardData } from './Card';
import { GameEngine } from '../GameEngine';
import { DamageEffect } from '../effect/DamageEffect';
import { cardRegistry } from './CardRegistry';

/**
 * Killing Blow Card
 * 
 * Effect: Deals damage, increasing every time you play another card
 * 
 * @author Eric Blyth
 * @version 1.0
 */
export class KillingBlow extends Card {
  /**
   * Card constructor
   * Initialises values based on default, can instead pass cardData to restore mutable stats
   * 
   * @param data Passed cardData
   * 
   * @see cardData
   */
  constructor(data?: Partial<cardData>) {
    super({
      cardId: 'killing-blow',
      name: 'Killing Blow',
      description: 'Deal 2 damage. Playing another card increases this damage by its cost.',
      baseCost: 3,
      currentCost: 3,
      baseAttack: 2,
      currentAttack: 2,
      ...data,
    });
  }

  /**
   * Execution of the KillingBlow card effect
   * 
   * @param engine GameEngine executing this function
   * 
   * @see GameEngine
   * @see DamageEffect
   */
  execute(engine: GameEngine): void {
    new DamageEffect(this.currentAttack).resolve(engine);
  }

  /**
   * Updates this card, increasing its damage
   * Runs when another card is played
   * 
   * @param Card The other Card that was played
   * @param engine GameEngine executing this function
   * 
   * @see GameEngine 
   */
  onOtherCardPlayed(card: Card, engine: GameEngine): void {
    const baseAttack = 2;
    const boostedAttackAmount = card.currentCost;

    this.currentAttack = (this.currentAttack ?? (this.baseAttack ?? baseAttack)) + boostedAttackAmount;
    
  }
}

cardRegistry.register('killing-blow', KillingBlow);
