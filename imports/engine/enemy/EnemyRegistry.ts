// EnemyRegistry.ts

import { Enemy, enemyData } from './Enemy';

export class EnemyRegistry {

  private registry: Map<string, new (data?: any) => Enemy> = new Map();

  register(enemyId: string, EnemyClass: new (data?: any) => Enemy): void {
    this.registry.set(enemyId, EnemyClass);
  }

  create(data: enemyData): Enemy {
    const EnemyClass = this.registry.get(data.enemyId);
    if (!EnemyClass) throw new Error(`Unknown enemyId: ${data.enemyId}`);
    return new EnemyClass(data);
  }

  get(enemyId: string): (new (data?: any) => Enemy) | undefined {
    return this.registry.get(enemyId);
  }
}

export const enemyRegistry = new EnemyRegistry();
