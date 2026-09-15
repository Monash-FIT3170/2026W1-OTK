import type { GameEngine } from '../GameEngine';
import { cardRegistry } from '../card/CardRegistry';
import { getStageConfig } from '../stages';
import { Powerup } from './Powerup';
import { powerupRegistry } from './PowerupRegistry';

export class RestartStagePowerup extends Powerup {
  constructor(data: Partial<ConstructorParameters<typeof Powerup>[0]> = {}) {
    super({
      powerupId: 'restart-stage',
      name: 'Restart Stage',
      description: 'Reset the current stage and redraw your starting hand.',
      tier: 'rare',
      maxStacks: 1,
      currentStacks: 0,
      available: true,
      ...data,
    });
  }

  applyTo(engine: GameEngine): void {
    if (!this.isAvailable()) {
      throw new Error('Restart Stage powerup is unavailable');
    }

    const { BossClass } = getStageConfig(engine.stage);

    engine.enemy = new BossClass();
    engine.deck = engine.baseDeck.map((card) => {
      const fresh = cardRegistry.create({
        ...card.toJSON(),
        uniqueId: undefined,
        isFrozen: false,
      });
      fresh.resetStats();
      return fresh;
    });

    engine.hand = [];
    engine.result = 'playing';
    engine.stageStartedAt = Date.now();
    engine.cardsUsedThisStage = 0;

    engine.shuffle();
    engine.activateEnemyDebuffs();
    engine.draw();

    this.currentStacks = 1;
    this.available = false;
  }
}

powerupRegistry.register('restart-stage', RestartStagePowerup);
