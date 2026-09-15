import type { GameEngine } from '../GameEngine';

export type PowerupTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type PowerupData = {
  powerupId: string;
  name: string;
  description: string;
  tier?: PowerupTier;
  maxStacks?: number;
  currentStacks?: number;
  available?: boolean;
};

export abstract class Powerup {
  public powerupId: string;
  public name: string;
  public description: string;
  public tier: PowerupTier;
  public maxStacks: number;
  public currentStacks: number;
  public available: boolean;

  constructor(data: PowerupData) {
    this.powerupId = data.powerupId;
    this.name = data.name;
    this.description = data.description;
    this.tier = data.tier ?? 'common';
    this.maxStacks = data.maxStacks ?? 1;
    this.currentStacks = data.currentStacks ?? 0;
    this.available = data.available ?? true;
  }

  abstract applyTo(engine: GameEngine): void;

  isAvailable(): boolean {
    return this.available && this.currentStacks < this.maxStacks;
  }

  addStack(amount: number = 1): void {
    if (amount <= 0) return;
    this.currentStacks = Math.min(this.maxStacks, this.currentStacks + amount);
  }

  resetStacks(): void {
    this.currentStacks = 0;
  }

  toJSON(): PowerupData {
    return {
      powerupId: this.powerupId,
      name: this.name,
      description: this.description,
      tier: this.tier,
      maxStacks: this.maxStacks,
      currentStacks: this.currentStacks,
      available: this.available,
    };
  }
}
