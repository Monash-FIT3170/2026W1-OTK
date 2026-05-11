import { useState } from 'react';
import { Meteor } from 'meteor/meteor';

export function usePlayCard() {
  // Set during the selection step: { uniqueCardId, cardAmountToSelect: { min, max } }
  // null when no card is waiting for selection
  const [pendingSelection, setPendingSelection] = useState(null);

  // Called when a card is dragged out of the hand.
  // Uses card.cardAmountToSelect to decide whether to prompt for selection or execute immediately.
  const onPlay = (card) => {
    if (card.cardAmountToSelect) {
      setPendingSelection({
        uniqueCardId: card.uniqueId,
        card,
        cardAmountToSelect: card.cardAmountToSelect,
      });
    } else {
      Meteor.call(
        'game.executeCard',
        { uniqueCardId: card.uniqueId, selectedCardIds: [] },
        (execErr) => {
          if (execErr) console.error('game.executeCard failed:', execErr);
        }
      );
    }
  };

  // Called when the player confirms their card selection.
  const confirmSelection = (selectedCardIds) => {
    if (!pendingSelection) return;

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
