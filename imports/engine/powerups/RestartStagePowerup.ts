import type { GameEngine } from '../GameEngine';
import { cardRegistry } from '../card/CardRegistry';
import { getStageConfig } from '../stages';
import { PowerUp, type powerUpDataInput } from './Powerup';
import { powerUpRegistry } from './PowerupRegistry';

export class RestartStagePowerup extends PowerUp {
  constructor(data: powerUpDataInput = {}) {
    super({
      powerUpId: 'restart-stage',
      name: 'Restart Stage',
      description: 'Reset the current stage and redraw your starting hand.',
      icon: '',
      tier: 'rare',
      maxStacks: 1,
      currentStacks: 0,
      available: true,
      ...data,
    });
  }

  apply(engine: GameEngine): void {
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

powerUpRegistry.register('restart-stage', RestartStagePowerup);
