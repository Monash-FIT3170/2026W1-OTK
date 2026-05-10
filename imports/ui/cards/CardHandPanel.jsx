import { Card } from './Card';
import { motion } from 'framer-motion';
import { SelectionPanel } from './SelectionPanel';
import { SelectionHand } from 'imports/engine/card/SelectionHand';
import { useState } from 'react';

export function CardHandPanel({ cardHand }) {
  const cardArray = cardHand.returnAllCards();
  const numCards = cardArray.length;
  let firstLoad = true;
  const [selectionHand, setSelectionHand ] = useState(null);

  const cardWidth = 176;
  const containerWidth = window.innerWidth - 40;
  const marginLeft =
    numCards > 1
      ? -Math.max(0, (cardWidth * numCards - containerWidth) / (numCards - 1))
      : 0;

  const onHandCardClick = (card) => {
    if (card.cardAmountToSelect !== null) {
      const newSelectionHand = new SelectionHand(card);
      newSelectionHand.addSelection(card)
      setSelectionHand(newSelectionHand);
    }
    cardHand.removeCard(card);
  };

  return (
    <div>
      {selectionHand && <SelectionPanel selectionHand={selectionHand} />}
      <div className="flex flex-row overflow-x-hidden overflow-y-hidden border rounded-xl p-5 bg-amber-50 min-h-70 w-full">
        <div className="flex flex-row justify-center w-full">
          {cardArray.map((card, idx) => (
            <motion.div
              style={{ marginLeft: idx !== 0 ? `${marginLeft}px` : '0px' }}
              key={card.cardId}
              onClick={() => onHandCardClick(card)}
            >
              <Card cardProps={card} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
