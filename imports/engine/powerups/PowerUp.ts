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
  // TODO: hook up to real player stats once those exist on GameEngine.
  abstract apply(engine: GameEngine): void;

  applyTo(engine: GameEngine): void {
    this.apply(engine);
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