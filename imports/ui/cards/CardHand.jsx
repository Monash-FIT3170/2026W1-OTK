import { useRef, useState, useEffect } from 'react';
import { usePlayCard } from '../hooks/usePlayCard';
import { SelectionPanel } from './SelectionPanel';
import { DraggableCard } from './DraggableCard';

export default function CardHand({ cards }) {
  const [hand, setHand] = useState(
    Array.isArray(cards) ? cards : Object.values(cards)
  );

  // Sync local hand state whenever the server pushes updated card data (e.g. after draws).
  // Skipped while a selection is pending to avoid clobbering the in-progress UI state.
  const { onPlay, pendingSelection, confirmSelection } = usePlayCard();
  useEffect(() => {
    if (!pendingSelection) {
      setHand(Array.isArray(cards) ? cards : Object.values(cards));
    }
  }, [JSON.stringify(cards)]);
  const [selectedTargets, setSelectedTargets] = useState([]);
  const handRef = useRef(null);

  const numCards = hand.length;
  const cardWidth = 176;
  const containerWidth = window.innerWidth - 40;
  const marginLeft =
    numCards > 1
      ? -Math.max(0, (cardWidth * numCards - containerWidth) / (numCards - 1))
      : 0;

  const onDragPlay = (uniqueId) => {
    const card = hand.find((c) => c.uniqueId === uniqueId);
    setHand((prev) => prev.filter((c) => c.uniqueId !== uniqueId));
    onPlay(card);
  };

  const onHandCardClick = (card) => {
    if (!pendingSelection) return;
    // Selection mode: toggle card as a target
    const { max } = pendingSelection.cardAmountToSelect;
    const alreadySelected = selectedTargets.some((c) => c.uniqueId === card.uniqueId);
    if (alreadySelected) {
      setSelectedTargets((prev) => prev.filter((c) => c.uniqueId !== card.uniqueId));
      setHand((prev) => [...prev, card]);
    } else if (selectedTargets.length < max) {
      setSelectedTargets((prev) => [...prev, card]);
      setHand((prev) => prev.filter((c) => c.uniqueId !== card.uniqueId));
    }
  };

  const onConfirm = () => {
    confirmSelection(selectedTargets.map((c) => c.uniqueId));
    setHand((prev) => [...prev, ...selectedTargets]);
    setSelectedTargets([]);
  };

  return (
    <div className="flex flex-col w-full">
      {pendingSelection && (
        <SelectionPanel
          pendingSelection={pendingSelection}
          selectedTargets={selectedTargets}
          onDeselectCard={(card) => {
            setSelectedTargets((prev) => prev.filter((c) => c.uniqueId !== card.uniqueId));
            setHand((prev) => [...prev, card]);
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}
