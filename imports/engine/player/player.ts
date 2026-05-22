export type PlayerAnimationState = 'idle' | 'attack' | 'final_attack' | 'dead';

export interface PlayerPosition {
  x: number;
  y: number;
}

export interface PlayerAnimation {
  state: PlayerAnimationState;
  spritePath: string;
}

export class Player {
  position: PlayerPosition;
  animation: PlayerAnimation;

  constructor(startX = 0, startY = 0) {
    this.position = {
      x: startX,
      y: startY,
    };

    this.animation = {
      state: 'idle',
      spritePath: '/assets/sprites/player/MC-idle.gif',
    };
  }

  getIdleSpritePath(): string {
    return this.animation.spritePath;
  }
}
