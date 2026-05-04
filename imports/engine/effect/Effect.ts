/**
 * @author Justin La
 * Represents the gameplay effect during card action
 */
import { GameEngine } from "../GameEngine";

export interface Effect {
    resolve(engine: GameEngine, targetCardIndexes?: string[]): void;
}