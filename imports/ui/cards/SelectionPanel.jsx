import { Card } from './Card';
import { motion } from 'motion/react';

export function SelectionPanel({
  selectionHand,
  onSelectionCardClick,
}) {
  const cardHand = Object.entries(cardHand);
  const selections = Object.entries(selectionHand);

  return (
    <div className="flex flex-row overflow-x-hidden overflow-y-hidden border rounded-xl p-5 bg-amber-50 w-full">
      <div className="flex flex-row justify-center w-full">
        <p>Select cards</p>
        {selectionHand.map(([cardId, card]) => (
          <div
            key={cardId}
            onClick={() => onSelectedCardClick(cardId)}
            className=""
          >
            <Card cardProps={card} />
          </div>
        ))}
      </div>
    </div>
  );
}
