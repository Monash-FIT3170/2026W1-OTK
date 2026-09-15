// PowerUp.ts

import type { GameEngine } from '../GameEngine';

export type powerUpData = {
  powerUpId: string;
  name: string;
  description: string;
  icon: string; // path under public/assets/ui
};

export abstract class PowerUp {
  public powerUpId: string;
  public name: string;
  public description: string;
  public icon: string;

  constructor(data: powerUpData) {
    this.powerUpId = data.powerUpId;
    this.name = data.name;
    this.description = data.description;
    this.icon = data.icon;
  }

  // Concrete power-ups override this to affect the player's game state.
  // TODO: hook up to real player stats once those exist on GameEngine.
  abstract apply(engine: GameEngine): void;

  toJSON(): powerUpData {
    return {
      powerUpId: this.powerUpId,
      name: this.name,
      description: this.description,
      icon: this.icon,
    };
  }
}
