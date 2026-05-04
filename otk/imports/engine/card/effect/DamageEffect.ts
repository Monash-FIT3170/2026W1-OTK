/**
 * Damage effect for cards, applies damage to enemy
 */
import { GameEngine } from "../GameEngine";
import { Effect } from "./Effect";

export class DamageEffect implements Effect {
    private amount: number;

    // constructs damage effect with the amount of damage to deal
    constructor(amount: number = 0) {
        this.amount = amount;
    }
    // applies the damage to the enemy
    resolve(engine: GameEngine, targetCardIndexes?: string[]): void {
        if (this.amount >0) {
            engine.enemy.takeDamage(this.amount);
        }
    }
}





