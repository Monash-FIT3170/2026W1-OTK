import { useState } from 'react';
import { DraggableCard } from './DraggableCard';

const CARD_WIDTH = 300;
const CONTAINER_WIDTH = 1410; // design canvas width (1920) minus hand-area padding
const MAX_SPREAD = 60; // px neighbours slide away from the hovered card

// Shared hand layout used by the main game (CardHand) and training mode.
// Overlaps cards so the whole hand fits CONTAINER_WIDTH, and on hover brings
// the hovered card to the top, stacks the rest by distance from it, and slides
// neighbours apart. Renders only the cards - the parent supplies the container
// (which must not add its own gap between cards).
export function HandLayout({
  cards,
  handRef,
  onPlay,
  onCardClick,
  isInSelectionMode = false,
  isAffordable = () => true,
}) {
  const [hoveredId, setHoveredId] = useState(null);

  const numCards = cards.length;
  const marginLeft =
    numCards > 1
      ? -Math.max(0, (CARD_WIDTH * numCards - CONTAINER_WIDTH) / (numCards - 1))
      : 0;

  const ordered = [...cards].reverse();
  const hoveredIdx = ordered.findIndex((c) => c.uniqueId === hoveredId);
  const spread = Math.min(-marginLeft, MAX_SPREAD); // 0 when cards don't overlap

  return ordered.map((card, idx) => {
    const dist = hoveredIdx === -1 ? 0 : idx - hoveredIdx;
    return (
      <DraggableCard
        key={card.uniqueId}
        cardProps={card}
        marginLeft={idx !== 0 ? `${marginLeft}px` : '0px'}
        onClick={() => onCardClick?.(card)}
        handRef={handRef}
        onPlay={onPlay}
        isInSelectionMode={isInSelectionMode}
        affordable={isAffordable(card)}
        playable={!card.isFrozen}
        zIndex={
          hoveredIdx === -1 ? undefined : dist === 0 ? 100 : 50 - Math.abs(dist)
        }
        shiftX={dist === 0 ? 0 : (Math.sign(dist) * spread) / Math.abs(dist)}
        onHoverChange={(isOver) =>
          setHoveredId((cur) =>
            isOver ? card.uniqueId : cur === card.uniqueId ? null : cur
          )
        }
      />
    );
  });
}
