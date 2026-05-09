import Card from './Card';
import { motion } from 'motion/react';

export default function SelectionPanel({
  cardHand,
  discardHand,
  onHandCardClick,
  onDiscardCardClick,
}) {
  const cardHand = Object.entries(cardHand);
  const selections = Object.entries(discardHand);

  return (
    <div className="flex flex-row overflow-x-hidden overflow-y-hidden border rounded-xl p-5 bg-amber-50 w-full">
      <div className="flex flex-row justify-center w-full">
        <p>Select cards</p>
        {discardHand.map(([cardId, card]) => (
          <div
            key={cardId}
            onClick={() => onDiscardCardClick(cardId)}
            className=""
          >
            <Card cardProps={card} />
          </div>
        ))}

        <button
          onClick={onConfirm}
          className="px-5 py-2 bg-red-600 text-white font-bold rounded-xl"
        >
          Done
        </button>

        <p>Current hand</p>
        {cardHand.map(([cardId, card]) => (
          <div
            key={cardId}
            onClick={() => onHandCardClick(cardId)}
            className=""
          >
            <Card cardProps={card} />
          </div>
        ))}
      </div>
    </div>
  );
}
