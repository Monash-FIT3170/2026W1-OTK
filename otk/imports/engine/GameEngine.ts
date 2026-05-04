// GameEngine.ts
import { Card } from "./card/Card";

class Enemy {
  takeDamage(amount: number): void {}
}

export class GameEngine {
  enemy: Enemy = new Enemy();
  hand: Card[] = [];
  deck: Card[] = [];

  removeFromHand(cardId: string): void {
    const index = this.hand.findIndex(card => card.cardId === cardId);
    if (index !== -1) {
      this.hand.splice(index, 1);
    }
  }
};
