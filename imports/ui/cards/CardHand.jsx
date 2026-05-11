import { useRef, useState } from 'react';
import { usePlayCard } from '../hooks/usePlayCard';
import { SelectionPanel } from './SelectionPanel';
import { DraggableCard } from './DraggableCard';

export default function CardHand({ cards, deckSize }) {
  const [selectedTargets, setSelectedTargets] = useState([]);
  const handRef = useRef(null);

  const { onPlay, pendingSelection, confirmSelection } = usePlayCard();

  const hand = cards.filter(
    (c) =>
      !selectedTargets.some((s) => s.uniqueId === c.uniqueId) &&
      // Remove cards being selected from hand display
      c.uniqueId !== pendingSelection?.uniqueCardId
    // Remove card being played during selection from hand display
  );

  const numCards = hand.length;
  const cardWidth = 176;
  const containerWidth = window.innerWidth - 40;
  const marginLeft =
    numCards > 1
      ? -Math.max(0, (cardWidth * numCards - containerWidth) / (numCards - 1))
      : 0;

  const onDragPlay = (uniqueId) => {
    const card = hand.find((c) => c.uniqueId === uniqueId);
    onPlay(card);
  };

  const onHandCardClick = (card) => {
    if (!pendingSelection) return;
    // Selection mode: toggle card as a target
    const { max } = pendingSelection.cardAmountToSelect;
    const alreadySelected = selectedTargets.some(
      (c) => c.uniqueId === card.uniqueId
    );
    if (alreadySelected) {
      setSelectedTargets((prev) =>
        prev.filter((c) => c.uniqueId !== card.uniqueId)
      );
    } else if (selectedTargets.length < max) {
      setSelectedTargets((prev) => [...prev, card]);
    }
  };

  const onConfirm = () => {
    confirmSelection(selectedTargets.map((c) => c.uniqueId));
    setSelectedTargets([]);
  };

  return (
    <div className="flex flex-col w-full">
      {pendingSelection && (
        <SelectionPanel
          pendingSelection={pendingSelection}
          selectedTargets={selectedTargets}
          onDeselectCard={(card) => {
            setSelectedTargets((prev) =>
              prev.filter((c) => c.uniqueId !== card.uniqueId)
            );
          }}
          onConfirm={onConfirm}
        />
      )}
      <div
        ref={handRef}
        className="flex flex-row border rounded-xl p-5 bg-amber-50 min-h-70 w-full"
      >
        <div className="flex flex-row justify-center w-full">
          {hand.map((card, idx) => (
            <DraggableCard
              key={card.uniqueId}
              cardProps={card}
              marginLeft={idx !== 0 ? `${marginLeft}px` : '0px'}
              onClick={() => onHandCardClick(card)}
              handRef={handRef}
              onPlay={onDragPlay}
              draggable={!pendingSelection}
              affordable={card.currentCost <= deckSize}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
