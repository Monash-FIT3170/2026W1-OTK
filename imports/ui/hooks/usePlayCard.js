import { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { soundManager } from '../soundManager';

export function usePlayCard() {
  // Set during the selection step: { uniqueCardId, cardAmountToSelect: { min, max } }
  // null when no card is waiting for selection
  const [pendingSelection, setPendingSelection] = useState(null);

  // Called when a card is dragged out of the hand.
  // Uses card.cardAmountToSelect to decide whether to prompt for selection or execute immediately.
  const onPlay = (card) => {
    Meteor.call('game.drawCards', { uniqueCardId: card.uniqueId }, (err, result) => {
      if (err) {
        console.error('game.drawCards failed:', err);
        return;
      }
      if (result.requiresSelection) {
        setPendingSelection({
          uniqueCardId: card.uniqueId,
          card,
          cardAmountToSelect: result.cardAmountToSelect,
        });
      } else {
        soundManager.playCardSound(card.cardId);
        Meteor.call(
          'game.executeCard',
          { uniqueCardId: card.uniqueId, selectedCardIds: [] },
          (execErr) => {
            if (execErr) console.error('game.executeCard failed:', execErr);
          }
        );
      }
    });
  };

  const confirmSelection = (selectedCardIds) => {
    if (!pendingSelection) return;
    soundManager.playCardSound(pendingSelection.card.cardId);
    Meteor.call(
      'game.executeCard',
      { uniqueCardId: pendingSelection.uniqueCardId, selectedCardIds },
      (err) => {
        if (err) console.error('game.executeCard failed:', err);
      }
    );
    setPendingSelection(null);
  };

  return { onPlay, pendingSelection, confirmSelection };
}
