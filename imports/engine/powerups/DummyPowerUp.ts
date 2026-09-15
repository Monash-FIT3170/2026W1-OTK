import type { GameEngine } from '../GameEngine';
import { PowerUp, type powerUpData } from './PowerUp';
import { powerUpRegistry } from './PowerUpRegistry';

// Placeholder power-up for testing the selection/inventory flow end-to-end.
export class DummyPowerUp extends PowerUp {
  constructor(data: Partial<powerUpData> = {}) {
    super({
      powerUpId: 'dummy-power-up',
      name: 'Dummy Power-Up',
      description: 'Does nothing yet - for testing the power-up flow.',
      icon: '/assets/sprites/powerups/dummy-pu.png',
      ...data,
    });
  }

  apply(engine: GameEngine): void {}
}

powerUpRegistry.register('dummy-power-up', DummyPowerUp);
