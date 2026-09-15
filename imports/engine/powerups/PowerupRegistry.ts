// PowerUpRegistry.ts

import type { PowerUp } from './PowerUp';

export class PowerUpRegistry {
  // stores the power-up class constructor per powerUpId
  private registry: Map<string, new () => PowerUp>;

  constructor() {
    this.registry = new Map();
  }

  register(powerUpId: string, PowerUpClass: new () => PowerUp): void {
    if (this.registry.has(powerUpId)) {
      throw new Error(`Power-up already registered: ${powerUpId}`);
    }
    this.registry.set(powerUpId, PowerUpClass);
  }

  create(powerUpId: string): PowerUp {
    const PowerUpClass = this.registry.get(powerUpId);
    if (!PowerUpClass) {
      throw new Error(`Unknown powerUpId: ${powerUpId}`);
    }
    return new PowerUpClass();
  }

  // Every registered id - the pool that stage-clear draws 3 from.
  allIds(): string[] {
    return [...this.registry.keys()];
  }
}

export const powerUpRegistry = new PowerUpRegistry();
