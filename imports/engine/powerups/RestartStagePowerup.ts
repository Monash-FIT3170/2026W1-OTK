import type { GameEngine } from '../GameEngine';
import { cardRegistry } from '../card/CardRegistry';
import { getStageConfig, SECRET_BOSS_STAGE } from '../stages';
import { PowerUp, powerUpData } from './PowerUp';
import { powerUpRegistry } from './PowerupRegistry';

export class RestartStagePowerup extends PowerUp {
  constructor(data?: Partial<powerUpData>) {
    super({
      powerUpId: 'restart-stage',
      name: 'Restart Stage',
      description: 'Reset the current stage and redraw your starting hand. One use per run.',
      icon: '/assets/sprites/powerups/restart-pu-sprite.png',
      available: true,
      consumedOnUse: true,
      ...data,
    });
  }

  apply(engine: GameEngine): boolean {
    const { BossClass } = getStageConfig(engine.stage);

    // The secret boss is built from the run's debuffs (see advanceStage), so
    // a bare new SecretBoss() would come back with none of them.
    engine.enemy =
      engine.stage === SECRET_BOSS_STAGE
        ? new BossClass({ debuffs: engine.debuffsFaced })
        : new BossClass();
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

    // Once-per-stage power-ups can be used again; consumed ones stay gone
    engine.refreshPowerUps();
    return true;
  }
}

powerUpRegistry.register('restart-stage', RestartStagePowerup);
