/**
 * Reload Card
 * This card when played forces you to shuffle your entire hand into your deck, then draw the exact same number of cards.
 * Has a cost of 1 draw
 */

import { Card, cardData } from './Card';
import { GameEngine } from '../GameEngine';
import { ReturnToDeckEffect } from '../effect/ReturnToDeckEffect';

export class Reload extends Card {
    constructor(data?: Partial<cardData>) {
        super({
          cardId: 'Reload',
          name: 'Reload',
          description: 'Return your entire hand to your deck, shuffle, then draw the same number of cards.',
          baseCost: 1,
          currentCost: 1,
          baseAttack: 0,
          currentAttack: 0,
          cardAmountToSelect: { min: 0, max: 0 },
          ...data,
        });

    }

    execute(engine: GameEngine, targetCardIndexes?: string[]): void {
        const handSize = engine.getHand().length;
        const allHandIds = engine.getHand().map(card => card.uniqueId);
        
        new ReturnToDeckEffect().resolve(engine, allHandIds);

        engine.shuffle();
        engine.draw(handSize);
        }
    }


