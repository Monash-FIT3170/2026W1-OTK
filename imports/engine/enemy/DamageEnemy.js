export class EnemyDamage {
  constructor(enemy) {
    if (!enemy || !Number.isFinite(enemy.currentHealth)) {
      throw new Error('Enemy must have a numeric currentHealth value.');
    }

    this.enemy = enemy;
  }

  //Getter method to return current health
  get currentHealth() {
    return this.enemy.currentHealth;
  }

  // Helper method to update enemy current health
  getDamage(damageValues) {
    const damage = EnemyDamage.totalDamage(damageValues);
    this.enemy.currentHealth = Math.max(0, this.enemy.currentHealth - damage);
    return this.enemy.currentHealth;
  }

  //Finds total damage value from a single card or an array of multiple cards
  static totalDamage(damageValues) {
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

// Helper method to apply final damage to any enemy 
export const applyEnemyDamage = (enemy, damageValues) =>
  new EnemyDamage(enemy).getDamage(damageValues);
