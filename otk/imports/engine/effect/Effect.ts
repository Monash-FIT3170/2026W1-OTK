// Effect.ts

// importing components
import { GameEngine } from "../GameEngine";

// defining interface
export interface Effect {
    resolve(engine: GameEngine, targetCardIds?: string[]): void;
}
