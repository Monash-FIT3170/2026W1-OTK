import { useRef, useState } from 'react';
import { usePlayCard } from '../hooks/usePlayCard';
import { SelectionPanel } from './SelectionPanel';
import { DraggableCard } from './DraggableCard';
import Card from './Card';

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
  const cardWidth = 300;
  const containerWidth = 1410; // design canvas width (1920) minus padding
  const marginLeft =
    numCards > 1
      ? -Math.max(0, (cardWidth * numCards - containerWidth) / (numCards - 1))
      : 0;

  const inSelectionMode = pendingSelection !== null;

  const onDragPlay = (uniqueId) => {
    const card = hand.find((c) => c.uniqueId === uniqueId);
    onPlay(card);
  };

  const onHandCardClick = (card) => {
    if (!pendingSelection) return;
    // Selection mode: toggle card as a target
    const { max: rawMax } = pendingSelection.cardAmountToSelect;
    const max = Math.min(rawMax, hand.length + selectedTargets.length);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center pb-90 pointer-events-none">
          <div className="pointer-events-auto">
            <SelectionPanel
              pendingSelection={pendingSelection}
              selectedTargets={selectedTargets}
              availableCount={hand.length + selectedTargets.length}
              onDeselectCard={(card) => {
                setSelectedTargets((prev) =>
                  prev.filter((c) => c.uniqueId !== card.uniqueId)
                );
              }}
              onConfirm={onConfirm}
            />
          </div>
        </div>
      )}
      <div ref={handRef} className="flex flex-row min-h-70 w-full">
        <div className="flex flex-row justify-center w-full">
          {hand.length === 0 && (
            <div className="invisible">
              <Card
                cardProps={{
                  cardId: 'placeholder-card',
                  name: '',
                  description: '',
                  currentCost: 0,
                  baseCost: 0,
                  currentAttack: 0,
                  baseAttack: 0,
                }}
              />
            </div>
          )}
          {[...hand].reverse().map((card, idx) => (
            <DraggableCard
              key={card.uniqueId}
              cardProps={card}
              marginLeft={idx !== 0 ? `${marginLeft}px` : '0px'}
              onClick={() => onHandCardClick(card)}
              handRef={handRef}
              onPlay={onDragPlay}
              isInSelectionMode={inSelectionMode}
              affordable={card.currentCost <= deckSize}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
