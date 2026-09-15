// PowerUp.ts

import type { GameEngine } from '../GameEngine';

export type powerupData = {
  powerUpId: string;
  name: string;
  description: string;
  icon?: string;
  tier?: string;
  maxStacks?: number;
  currentStacks?: number;
  available?: boolean;
};

export type powerUpData = powerupData;
export type powerUpDataInput = Partial<powerupData> & { powerupId?: string };
export type powerupDataInput = powerUpDataInput;

export abstract class PowerUp {
  public powerUpId: string;
  public powerupId: string;
  public name: string;
  public description: string;
  public icon: string;
  public tier: string;
  public maxStacks: number;
  public currentStacks: number;
  public available: boolean;

  constructor(data: powerUpDataInput = {}) {
    const resolvedId = data.powerUpId ?? data.powerupId ?? '';

    this.powerUpId = resolvedId;
    this.powerupId = resolvedId;
    this.name = data.name ?? '';
    this.description = data.description ?? '';
    this.icon = data.icon ?? '';
    this.tier = data.tier ?? 'common';
    this.maxStacks = data.maxStacks ?? 1;
    this.currentStacks = data.currentStacks ?? 0;
    this.available = data.available ?? true;
  }

  // Concrete power-ups override this to affect the player's game state.
  // TODO: hook up to real player stats once those exist on GameEngine.
  abstract apply(engine: GameEngine): void;

  applyTo(engine: GameEngine): void {
    this.apply(engine);
  }

  isAvailable(): boolean {
    return this.available;
  }

  toJSON(): powerupData {
    return {
      powerUpId: this.powerUpId,
      name: this.name,
      description: this.description,
      icon: this.icon,
      tier: this.tier,
      maxStacks: this.maxStacks,
      currentStacks: this.currentStacks,
      available: this.available,
    };
  }
}