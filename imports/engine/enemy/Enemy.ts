// Enemy.ts

export type enemyData = {
  enemyId: string;
  name: string;
  health: number;
  currentHealth: number;
  debuffs: string[];
  entryAnimation: string;
  hitAnimation: string;
};

export abstract class Enemy {

  public enemyId: string;
  public name: string;
  public health: number;
  public currentHealth: number;
  public debuffs: string[];
  public entryAnimation: string;
  public hitAnimation: string;

  constructor(data: {
    enemyId: string;
    name: string;
    health: number;
    currentHealth?: number;
    debuffs?: string[];
    entryAnimation?: string;
    hitAnimation?: string;
  }) {
    this.enemyId = data.enemyId;
    this.name = data.name;
    this.health = data.health;
    this.currentHealth = data.currentHealth ?? data.health;
    this.debuffs = data.debuffs ?? [];
    this.entryAnimation = data.entryAnimation ?? 'fade';
    this.hitAnimation = data.hitAnimation ?? 'shake';
  }

  takeDamage(amount: number): void {
    this.currentHealth = Math.max(0, this.currentHealth - amount);
  }

  toJSON(): enemyData {
    return {
      enemyId: this.enemyId,
      name: this.name,
      health: this.health,
      currentHealth: this.currentHealth,
      debuffs: [...this.debuffs],
      entryAnimation: this.entryAnimation,
      hitAnimation: this.hitAnimation,
    };
  }
}
