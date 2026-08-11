/**
 * Discard card or buff card effect, when a card with this effect is played, probability
 * that target cards are discarded, or buffs are added and card is returned to deck.
 */
import { GameEngine } from '../GameEngine';
import { Effect } from './Effect';
import { Card } from '../card/Card';
import { DiscardEffect } from './DiscardEffect';
import { ReturnToDeckEffect } from './ReturnToDeckEffect';
const PROBABILITY_OF_DISCARD: number = 0.5;

export class DiscardBuffEffect implements Effect {
  resolve(engine: GameEngine, targetCardIndexes?: string[]) {
    if (!targetCardIndexes) return;

    const cardsSelected: Card[] = [];
    targetCardIndexes.forEach((id: string) => {
      const card = engine.hand.find((card: Card) => card.uniqueId === id);
      if (card) {
        cardsSelected.push(card);
      }
    });

    cardsSelected.forEach((card) => {
      if (Math.random() < PROBABILITY_OF_DISCARD) {
        new DiscardEffect().resolve(engine, [card.uniqueId]);
      } else {
        new ReturnToDeckEffect().resolve(engine, [card.uniqueId]);
        card.currentCost = Math.max(0, card.currentCost - 1);
        card.currentAttack = Math.max(0, (card.currentAttack || 0) - 1);
      }
    });
  }
}
