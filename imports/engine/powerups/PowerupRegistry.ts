import type { Powerup, PowerupData } from './Powerup';
import { Powerup as BasePowerup } from './Powerup';

export class PowerupRegistry {
  private registry: Map<string, new (data?: Partial<PowerupData>) => Powerup> = new Map();

  register(powerupId: string, PowerupClass: new (data?: Partial<PowerupData>) => Powerup): void {
    if (this.registry.has(powerupId)) {
      throw new Error(`Powerup already registered: ${powerupId}`);
    }

    this.registry.set(powerupId, PowerupClass);
  }

  create(data: PowerupData): Powerup {
    const PowerupClass = this.registry.get(data.powerupId);
    if (!PowerupClass) {
      throw new Error(`Unknown powerupId: ${data.powerupId}`);
    }

    return new PowerupClass(data);
  }

  get(powerupId: string): (new (data?: Partial<PowerupData>) => Powerup) | undefined {
    return this.registry.get(powerupId);
  }
}

export const powerupRegistry = new PowerupRegistry();

export { BasePowerup as Powerup };
