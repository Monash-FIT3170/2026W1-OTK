// PowerUp.ts

import type { GameEngine } from '../GameEngine';
import { powerUpData } from '../types';
export type { powerUpData };

export abstract class PowerUp {
  powerUpId: string;
  name: string;
  description: string;
  icon: string;
  available?: boolean;
  consumedOnUse?: boolean;

  constructor(data: {
    powerUpId: string;
    name: string;
    description: string;
    icon: string;
    available?: boolean;
    consumedOnUse?: boolean;
  }) {
    this.powerUpId = data.powerUpId;
    this.name = data.name ?? '';
    this.description = data.description ?? '';
    this.icon = data.icon ?? '';
    this.available = data.available ?? true;
    this.consumedOnUse = data.consumedOnUse ?? false;
  }

  // Concrete power-ups override this to affect the player's game state.
  // Returns false when there was nothing to do (e.g. empty hand), so the
  // engine leaves the power-up unspent. Availability and removal are
  // handled by GameEngine.usePowerUp, not here.
  abstract apply(engine: GameEngine): boolean;

  applyTo(engine: GameEngine): boolean {
    return this.apply(engine);
  }

  isAvailable(): boolean {
    return this.available ?? true;
  }

  toJSON(): powerUpData {
    return {
      powerUpId: this.powerUpId,
      name: this.name,
      description: this.description,
      icon: this.icon,
      available: this.available,
      consumedOnUse: this.consumedOnUse,
    };
  }
}