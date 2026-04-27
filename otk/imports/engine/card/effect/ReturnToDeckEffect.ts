/**
 * ReturnToDeckEffect returns the selected cards to the deck
 */



export class ReturnToDeckEffect implements Effect {
    resolve(engine: GameEngine, targetCardIds?: string[]) {        
        targetCardIds?.forEach(id => {
            const card = engine.hand.find(card => card.cardId === id)
            if (card) {
                card.resetStats();
                engine.deck.push(card)
                engine.hand = engine.hand.filter(card => card.cardId != id)
            }
        })
    }
}
