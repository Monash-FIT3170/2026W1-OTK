// Enemy.ts

export type enemyData = {
  enemyId: string;
  name: string;
  health: number;
  currentHealth: number;
  debuffs: string[];
};

export abstract class Enemy {

  // defining attributes
  static entryAnimation = 'fade';
  static hitAnimation = 'shake';

  public enemyId: string;
  public name: string;
  public health: number;
  public currentHealth: number;
  public debuffs: string[];

  // constructs enemy
  constructor(data: {
    enemyId: string;
    name: string;
    health: number;
    currentHealth?: number;
    debuffs?: string[];
  }) {
    this.enemyId = data.enemyId;
    this.name = data.name;
    this.health = data.health;
    this.currentHealth = data.currentHealth ?? data.health;
    this.debuffs = data.debuffs ?? [];
  }

  // returns enemy data JSON object
  toJSON(): enemyData {
    return {
      enemyId: this.enemyId,
      name: this.name,
      health: this.health,
      currentHealth: this.currentHealth,
      debuffs: [...this.debuffs],
    };
  }
}
