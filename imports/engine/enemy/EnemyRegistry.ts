// EnemyRegistry.ts

// importing components
import { enemyData } from "./Enemy";

export class EnemyRegistry {

  // defining attributes
  public registry: Record<string, enemyData> = {};

  // constructs registry
  constructor(initialData: Record<string, enemyData> = {}) {
    this.registry = initialData;
  }

  // add an entry
  register(enemyId: string, value: enemyData): void {
    this.registry[enemyId] = value;
  }

  // get an entry
  get(enemyId: string): enemyData | undefined {
    return this.registry[enemyId];
  }

}

export const enemyRegistry = new EnemyRegistry();
