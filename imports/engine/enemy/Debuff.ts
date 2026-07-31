import { Enemy } from './Enemy';

  export type debuffData = {
    debuffId: string;
    name: string;
    debuffAnimation?: string;
  };

  export class Debuff {
    public debuffId: string;
    public name: string;
    public debuffAnimation: string;

    constructor(data: debuffData) {
      this.debuffId = data.debuffId;
      this.name = data.name;
      this.debuffAnimation = data.debuffAnimation ?? 'shake';
    }

    // Adds this debuff id to the enemy's active debuffs (idempotent)
    applyTo(enemy: Enemy): void {
      if (!enemy.debuffs.includes(this.debuffId)) {
        enemy.debuffs.push(this.debuffId);
      }
    }

    // Activates the debuff effect on the given enemy. For simple damage-style
    // debuffs this reduces the enemy health via `takeDamage`.
    activateDebuff(enemy: Enemy, amount: number): void {
      enemy.takeDamage(amount);
    }

    toJSON(): debuffData {
      return {
        debuffId: this.debuffId,
        name: this.name,
        debuffAnimation: this.debuffAnimation,
      };
    }
  }