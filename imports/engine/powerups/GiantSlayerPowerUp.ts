import type { GameEngine } from '../GameEngine';
import { cardRegistry } from '../card/CardRegistry';
import { Card } from '../card/Card';
import { PowerUp, type powerUpDataInput } from './Powerup';
import { powerUpRegistry } from './PowerupRegistry';

export class GiantSlayerPowerUp extends PowerUp {
  constructor(data: powerUpDataInput = {}) {
    super({
      powerUpId: 'giant-slayer',
      name: 'Giant Slayer',
      description:
        'Multiplies the highest damage dealing card based on % remaining health of enemy',
      icon: '',
      tier: 'rare',
      maxStacks: 1,
      currentStacks: 1,
      available: true,
      ...data,
    });
  }

  apply(engine: GameEngine): void {
    if (!this.isAvailable()) {
      throw new Error('Duplicate Cards powerup is unavailable');
    }

    if (engine.hand.some((card) => card.currentAttack !== undefined)) {
      this.giantslayer(engine, engine.hand);

      this.available = false;
    }
  }

  private giantslayer(engine: GameEngine, hand: Card[]): void {
    const highestAttackCard = hand.reduce<Card | undefined>((best, card) => {
      if (card.currentAttack === undefined) return best;
      if (best === undefined || card.currentAttack > best.currentAttack!)
        return card;
      return best;
    }, undefined);

    if (highestAttackCard == undefined) return;
    if (highestAttackCard.currentAttack == undefined) return;

    highestAttackCard.currentAttack +=
      (highestAttackCard.currentAttack * 2 * engine.enemy.currentHealth) /
      engine.enemy.health;
  }
}

powerUpRegistry.register('giant-slayer', GiantSlayerPowerUp);
