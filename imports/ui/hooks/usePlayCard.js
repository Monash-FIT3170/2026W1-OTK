import { useState } from 'react';
import { Meteor } from 'meteor/meteor';

export function usePlayCard() {
  // Set during the selection step: { cardId, cardAmountToSelect: { min, max } }
  // null when no card is waiting for selection
  const [pendingSelection, setPendingSelection] = useState(null);

  // Called when a card is dragged out of the hand.
  // Triggers the draw step, then either proceeds to execute or waits for selection.
  const onPlay = (cardId) => {
    Meteor.call('game.drawCards', { cardId }, (err, result) => {
      if (err) {
        console.error('game.drawCards failed:', err);
        return;
      }

      if (result.requiresSelection) {
        setPendingSelection({
          cardId,
          cardAmountToSelect: result.cardAmountToSelect,
        });
      } else {
        Meteor.call(
          'game.executeCard',
          { cardId, selectedCardIds: [] },
          (execErr) => {
            if (execErr) console.error('game.executeCard failed:', execErr);
          }
        );
      }
    });
  };

  // Called when the player confirms their card selection.
  const confirmSelection = (selectedCardIds) => {
    if (!pendingSelection) return;

    Meteor.call(
      'game.executeCard',
      { cardId: pendingSelection.cardId, selectedCardIds },
      (err) => {
        if (err) console.error('game.executeCard failed:', err);
      }
    );
    setPendingSelection(null);
  };

  return { onPlay, pendingSelection, confirmSelection };
}
