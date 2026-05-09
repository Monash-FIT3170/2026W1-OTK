import Card from './Card';
import { motion } from 'motion/react';
import SelectionPanel from './SelectionPanel';
import SelectionHand from 'imports/engine/card/SelectionHand';

export default function CardHand({ cards: cardHand }) {
  const cardArray = Object.values(cardHand);
  const numCards = cardArray.length;
  const selectionHand = new SelectionHand();

  const cardWidth = 176;
  const containerWidth = window.innerWidth - 40;

  const marginLeft =
    numCards > 1
      ? -Math.max(0, (cardWidth * numCards - containerWidth) / (numCards - 1))
      : 0;

  const onHandCardClick = (cardId) => {
    const card = cardHand[cardId];

    setHand((prev) => {
      const newHand = { ...prev };
      delete newHand[cardId];
      return newHand;
    });

    setSelectionHand((prev) => ({ ...prev, [cardId]: card }));
  };

  const onSelectionCardClick = (cardId) => {
    const card = SelectionHand[cardId];

    setSelectionHand((prev) => {
      const newSelectionHand = { ...prev };
      delete newSelectionHand[cardId];
      return newSelectionHand;
    });

    setHand((prev) => ({ ...prev, [cardId]: card }));
  };

  return (
    <div>
      <SelectionPanel
        cardHand={this}
        selectionHand={selectionHand}
        onHandCardClick={onHandCardClick}
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
