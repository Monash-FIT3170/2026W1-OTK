/**
 * @author: Justin La
 * Damage effect for cards
 */
import { GameEngine } from "../GameEngine";
import { Effect } from "./Effect";

export class DamageEffect implements Effect {
    private amount: number;

    constructor(amount: number) {
        this.amount = amount;
    }

    resolve(engine: GameEngine, targetCardIds?: string[]): void {
        engine.enemy.health -= this.amount;
    }
}





