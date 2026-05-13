// enemy_damage.ts

// importing components
import { enemyData } from "./Enemy";

export class EnemyDamage {

  // defining attributes
  private enemy: enemyData;

  // constructs enemy damage handler
  constructor(enemy: enemyData) {
    if (!enemy || !Number.isFinite(enemy.currentHealth)) {
      throw new Error('Enemy must have a numeric currentHealth value.');
    }
    this.enemy = enemy;
  }

  // getter for current health
  get currentHealth(): number {
    return this.enemy.currentHealth;
  }

  // applies damage and returns remaining health
  getDamage(damageValues: number | number[]): number {
    const damage = EnemyDamage.totalDamage(damageValues);
    this.enemy.currentHealth = Math.max(0, this.enemy.currentHealth - damage);
    return this.enemy.currentHealth;
  }

  // totals damage from a single value or array of values
  static totalDamage(damageValues: number | number[]): number {
    const values = Array.isArray(damageValues) ? damageValues : [damageValues];
    return values.reduce((total, damageValue) => {
      if (typeof damageValue !== 'number' || !Number.isFinite(damageValue)) {
        throw new Error('Damage value must be a finite number.');
      }
      if (damageValue < 0) {
        throw new Error('Damage value cannot be negative.');
      }
      return total + damageValue;
    }, 0);
  }
}

export const applyEnemyDamage = (enemy: enemyData, damageValues: number | number[]): number =>
  new EnemyDamage(enemy).getDamage(damageValues);
