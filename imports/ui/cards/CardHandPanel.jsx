import { Card } from './Card';
import { motion } from 'motion/react';
import { SelectionPanel } from './SelectionPanel';
import { SelectionHand } from 'imports/engine/card/SelectionHand';

export function CardHandPanel({ hand, selectionHand, onHandCardClick, onSelectionCardClick }) {
  const cardArray = hand.returnAllCards();
  const numCards = cardArray.length;

  const cardWidth = 176;
  const containerWidth = window.innerWidth - 40;
  const marginLeft =
    numCards > 1
      ? -Math.max(0, (cardWidth * numCards - containerWidth) / (numCards - 1))
      : 0;

  return (
    <div>
      <p>hello</p>
      <SelectionPanel
        selectionHand={selectionHand}
        onSelectionCardClick={onSelectionCardClick}
      />
      <div className="flex flex-row overflow-x-hidden overflow-y-hidden border rounded-xl p-5 bg-amber-50 w-full">
        <div className="flex flex-row justify-center w-full">
          {cardArray.map((card, idx) => (
            <motion.div
              style={{ marginLeft: idx !== 0 ? `${marginLeft}px` : '0px' }}
            >
              <Card cardProps={card} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
