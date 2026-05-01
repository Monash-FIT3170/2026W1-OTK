import { EnemyRegistry } from './EnemyRegistry.js';
import { Goblin } from './enemies/Goblin.js';

export { Enemy } from './Enemy.js';
export { EnemyDamage, applyEnemyDamage } from './enemy_damage.js';

export const enemyRegistry = new EnemyRegistry();

enemyRegistry.register(Goblin.enemyId, Goblin);
