/**
 * Holds a map of enemyId -> Enemy subclass constructor.
 * Used by the engine to instantiate enemies from stored enemyData.
 */
export class EnemyRegistry {
  constructor() {
    this.registry = new Map();
  }

  register(enemyId, EnemyClass) {
    if (this.registry.has(enemyId)) {
      throw new Error(`Enemy already registered: ${enemyId}`);
    }
    this.registry.set(enemyId, EnemyClass);
  }

  get(enemyId) {
    const EnemyClass = this.registry.get(enemyId);
    if (!EnemyClass) {
      throw new Error(`Unknown enemyId: ${enemyId}`);
    }
    return EnemyClass;
  }

  create(enemyData) {
    const EnemyClass = this.get(enemyData.enemyId);
    return new EnemyClass(enemyData);
  }
}