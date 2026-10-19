import type { GameEngine } from '../GameEngine';
import { PowerUp, powerUpData } from './PowerUp';
import { powerUpRegistry } from './PowerupRegistry';

const DAMAGE = 20;

export class DealDamagePowerUp extends PowerUp {
  constructor(data?: Partial<powerUpData>) {
    super({
      powerUpId: 'deal-damage-power-up',
      name: 'Deal Damage',
      description: `Deal ${DAMAGE} damage to the enemy.`,
      icon: '/assets/sprites/powerups/deal-damage-pu-sprite.png',
      available: true,
      consumedOnUse: false,
      ...data,
    });
  }

  apply(engine: GameEngine): boolean {
    engine.enemy.takeDamage(DAMAGE);
    return true;
  }
}

powerUpRegistry.register('deal-damage-power-up', DealDamagePowerUp);
