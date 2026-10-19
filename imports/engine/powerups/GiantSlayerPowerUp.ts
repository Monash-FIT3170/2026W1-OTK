import type { GameEngine } from '../GameEngine';
import { Card } from '../card/Card';
import { PowerUp, powerUpData } from './PowerUp';
import { powerUpRegistry } from './PowerupRegistry';

export class GiantSlayerPowerUp extends PowerUp {
  constructor(data?: Partial<powerUpData>) {
    super({
      powerUpId: 'giant-slayer',
      name: 'Giant Slayer',
      description:
        'Multiplies the highest damage dealing card based on % remaining health of enemy. One use per run.',
      icon: '/assets/sprites/powerups/giant-slayer-pu-sprite.png',
      available: true,
      consumedOnUse: true,
      ...data,
    });
  }

  apply(engine: GameEngine): boolean {
    if (!engine.hand.some((card) => card.currentAttack !== undefined)) return false;

    this.giantslayer(engine, engine.hand);
    return true;
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

    // Rounded so the boosted attack stays a whole number
    highestAttackCard.currentAttack += Math.round(
      (highestAttackCard.currentAttack * 2 * engine.enemy.currentHealth) /
        engine.enemy.health
    );
  }
}

powerUpRegistry.register('giant-slayer', GiantSlayerPowerUp);
