import type { GameEngine } from '../GameEngine';
import { PowerUp, type powerUpData } from './PowerUp';
import { powerUpRegistry } from './PowerUpRegistry';

const DAMAGE = 20;

export class DealDamagePowerUp extends PowerUp {
  constructor(data: Partial<powerUpData> = {}) {
    super({
      powerUpId: 'deal-damage-power-up',
      name: 'Deal Damage',
      description: `Deal ${DAMAGE} damage to the enemy. Consumed on use.`,
      icon: '/assets/sprites/powerups/dummy-pu.png',
      ...data,
    });
  }

  apply(engine: GameEngine): void {
    engine.enemy.takeDamage(DAMAGE);
  }
}

powerUpRegistry.register('deal-damage-power-up', DealDamagePowerUp);
