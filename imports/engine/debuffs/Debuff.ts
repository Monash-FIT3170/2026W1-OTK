import type { GameEngine } from '../GameEngine';
import type { Enemy } from '../enemy/Enemy';

export type debuffData = {
  debuffId: string;
  name: string;
  debuffAnimation?: string;
};

export abstract class Debuff {
  public debuffId: string;
  public name: string;
  public debuffAnimation: string;

  constructor(data: debuffData) {
    this.debuffId = data.debuffId;
    this.name = data.name;
    this.debuffAnimation = data.debuffAnimation ?? 'shake';
  }

  // Attaches this debuff to an enemy without adding duplicate entries.
  applyTo(enemy: Enemy): void {
    if (!enemy.debuffs.includes(this.debuffId)) {
      enemy.debuffs.push(this.debuffId);
    }
  }

  // Concrete debuffs override this to affect the player's game state.
  abstract activateDebuff(engine: GameEngine): void;

  // Called during normal game execution to maintain or refresh persistent debuffs.
  executeDebuff(engine: GameEngine): void {
    // Default is no-op; concrete debuffs may override if needed.
  }

  toJSON(): debuffData {
    return {
      debuffId: this.debuffId,
      name: this.name,
      debuffAnimation: this.debuffAnimation,
    };
  }
}
