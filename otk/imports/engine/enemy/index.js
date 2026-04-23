import { EnemyRegistry } from './EnemyRegistry.js';
import { Goblin } from './enemies/Goblin.js';

export const enemyRegistry = new EnemyRegistry();

enemyRegistry.register(Goblin.enemyId, Goblin);