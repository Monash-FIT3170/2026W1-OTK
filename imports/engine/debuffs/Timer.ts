import type { GameEngine } from '../GameEngine';
import { Debuff, type debuffData } from './Debuff';
import { debuffRegistry } from './DebuffRegistry';

export class Timer extends Debuff {
  constructor(data: Partial<debuffData> = {}) {
    super({
      debuffId: 'timer',
      name: 'Timer',
      debuffAnimation: 'timer',
      ...data,
    });
  }

  activateDebuff(engine: GameEngine): void {
    if (engine.enemy.timerDebuffActive) return;

    engine.enemy.timerDebuffActive = true;
    
    // Heal once by 10 after 5 seconds
    engine.enemy.timerDebuffInterval = 5000;
    engine.enemy.timerDebuffTickAmount = 10;
    
    // The deadline when the one-shot heal fires
    engine.enemy.timerDebuffDeadline = Date.now() + engine.enemy.timerDebuffInterval;
  }

  executeDebuff(engine: GameEngine): void {
    if (!engine.enemy.timerDebuffActive) {
      this.activateDebuff(engine);
    }
  }
}

debuffRegistry.register('timer', Timer);
