/**
 * @author Justin La
 * Represents the gameplay effect during card action
 */

type Effect = {
    resolve: (engine: GameEngine, targetCardIds?: string[]) => void
}

