// Enemy.ts

import { EnemyData } from '../types';
import { debuffRegistry } from '../debuffs';

export abstract class Enemy {

  public enemyId: string;
  public name: string;
  public health: number;
  public currentHealth: number;
  public debuffs: string[];
  public entryAnimation: string;
  public hitAnimation: string;
  public timerDebuffActive: boolean;
  public timerDebuffDeadline: number | null;
  public timerDebuffInterval: number;
  public timerDebuffTickAmount: number;
  public damageTakenCount: number;
  public shieldLayers: number;

  constructor(data: {
    enemyId: string;
    name: string;
    health: number;
    currentHealth?: number;
    debuffs?: string[];
    entryAnimation?: string;
    hitAnimation?: string;
    timerDebuffActive?: boolean;
    timerDebuffDeadline?: number;
    timerDebuffInterval?: number;
    timerDebuffTickAmount?: number;
    damageTakenCount?: number;
    shieldLayers?: number;
  }) {
    this.enemyId = data.enemyId;
    this.name = data.name;
    this.health = data.health;
    this.currentHealth = data.currentHealth ?? data.health;
    this.debuffs = data.debuffs ?? [];
    this.entryAnimation = data.entryAnimation ?? 'fade';
    this.hitAnimation = data.hitAnimation ?? 'shake';
    this.timerDebuffActive = data.timerDebuffActive ?? false;
    this.timerDebuffDeadline = data.timerDebuffDeadline ?? null;
    this.timerDebuffInterval = data.timerDebuffInterval ?? 5000;
    this.timerDebuffTickAmount = data.timerDebuffTickAmount ?? 5;
    this.damageTakenCount = data.damageTakenCount ?? 0;
    this.shieldLayers = data.shieldLayers ?? 0;
  }

  takeDamage(amount: number): void {
    this.damageTakenCount++;
    const modifiedAmount = this.debuffs.reduce(
      (damage, debuffId) =>
        debuffRegistry.create(debuffId).modifyIncomingDamage(this, damage),
      amount
    );
    this.currentHealth = Math.max(0, this.currentHealth - modifiedAmount);
  }

  toJSON(): EnemyData {
    return {
      enemyId: this.enemyId,
      name: this.name,
      health: this.health,
      currentHealth: this.currentHealth,
      debuffs: [...this.debuffs],
      entryAnimation: this.entryAnimation,
      hitAnimation: this.hitAnimation,
      timerDebuffActive: this.timerDebuffActive,
      timerDebuffDeadline: this.timerDebuffDeadline ?? undefined,
      timerDebuffInterval: this.timerDebuffInterval,
      timerDebuffTickAmount: this.timerDebuffTickAmount,
      damageTakenCount: this.damageTakenCount,
      shieldLayers: this.shieldLayers,
    };
  }
}
