import { Card } from './Card';
import { motion } from 'framer-motion';
import { SelectionPanel } from './SelectionPanel';
import { SelectionHand } from 'imports/engine/card/SelectionHand';
import { useState } from 'react';

export function CardHandPanel({ cardHand, setCardHand }) {
  const numCards = cardHand.cards.length;
  const [selectionHand, setSelectionHand] = useState(null);

  const cardWidth = 176;
  const containerWidth = window.innerWidth - 40;
  const marginLeft =
    numCards > 1
      ? -Math.max(0, (cardWidth * numCards - containerWidth) / (numCards - 1))
      : 0;

  const onHandCardClick = (card) => {
    let currentCardHand = Object.assign(Object.create(Object.getPrototypeOf(cardHand)), cardHand);
    if (card.cardAmountToSelect !== null) {
      let currentSelectionHand = selectionHand;
      if (!currentSelectionHand) {
        currentSelectionHand = new SelectionHand(card);
        currentCardHand.removeCard(card);
      }
      else{
        if (currentSelectionHand.selectedCard !== card) {
         if (currentSelectionHand.addSelection(card)){
            currentCardHand.removeCard(card);
          }
        }
      }
      
      setCardHand(currentCardHand);
      setSelectionHand(currentSelectionHand);
    }
  };

  return (
    <div>
      {selectionHand && <SelectionPanel selectionHand={selectionHand} setSelectionHand={setSelectionHand} cardHand={cardHand} setCardHand={setCardHand} />}
      <div className="flex flex-row overflow-x-hidden overflow-y-hidden border rounded-xl p-5 bg-amber-50 min-h-70 w-full">
        <div className="flex flex-row justify-center w-full">
          {cardHand.cards.map((card, idx) => (
            <motion.div
              style={{ marginLeft: idx !== 0 ? `${marginLeft}px` : '0px' }}
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
