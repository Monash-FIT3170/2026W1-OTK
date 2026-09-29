// PowerUpRegistry.ts

import type { PowerUp, powerupData } from './Powerup';

type PowerUpCtor = new (data?: Partial<powerupData>) => PowerUp;

export class PowerUpRegistry {
  // stores the power-up class constructor per powerUpId
  private registry: Map<string, PowerUpCtor>;

  constructor() {
    this.registry = new Map();
  }

  register(powerUpId: string, PowerUpClass: PowerUpCtor): void {
    if (this.registry.has(powerUpId)) {
      throw new Error(`Power-up already registered: ${powerUpId}`);
    }
    this.registry.set(powerUpId, PowerUpClass);
  }

  create(powerUpIdOrData: string | Partial<powerupData> | null | undefined): PowerUp {
    const id =
      typeof powerUpIdOrData === 'string'
        ? powerUpIdOrData
        : powerUpIdOrData && typeof powerUpIdOrData === 'object'
          ? powerUpIdOrData.powerUpId
          : undefined;

    if (!id) {
      throw new Error('Power-up id is required');
    }

    const PowerUpClass = this.registry.get(id);
    if (!PowerUpClass) {
      throw new Error(`Unknown powerUpId: ${id}`);
    }

    if (typeof powerUpIdOrData === 'string') {
      return new PowerUpClass();
    }

    return new PowerUpClass(powerUpIdOrData ?? {});
  }

  // Every registered id - the pool that stage-clear draws 3 from.
  allIds(): string[] {
    return [...this.registry.keys()];
  }
}

export const powerUpRegistry = new PowerUpRegistry();
export const powerupRegistry = powerUpRegistry;
export { PowerUpRegistry as PowerupRegistry };
