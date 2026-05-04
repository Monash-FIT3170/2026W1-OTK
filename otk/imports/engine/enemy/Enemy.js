/**
 * Abstract base class for all enemies.
 * Do not instantiate directly - extend it and register the subclass
 * via EnemyRegistry.
 */
export class Enemy {
  constructor({ enemyId, name, health, currentHealth = health, debuffs = [] }) {
  static entryAnimation = 'fade'; // default animation for all enemies, can be overridden by subclasses
  static hitAnimation = 'shake';  // default hit animation for all enemies, can be overridden by subclasses

    // abstract check so that this class is not instantiated
    if (new.target === Enemy) {
      throw new Error('Enemy is abstract and cannot be instantiated directly.');
    }
    this.enemyId = enemyId;
    this.name = name;
    this.health = health;
    this.currentHealth = currentHealth;
    this.debuffs = debuffs;
  }

  toJSON() {
    return {
      enemyId: this.enemyId,
      name: this.name,
      health: this.health,
      currentHealth: this.currentHealth,
      debuffs: [...this.debuffs],
    };
  }
}
