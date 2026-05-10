import { Card } from './Card';
import { motion } from 'framer-motion';

export function SelectionPanel({ selectionHand }) {
  const selections = Object.entries(selectionHand);
  const onSelectedCardClick = (card) => {
    selectionHand.removeSelection(card);
  };
  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-row overflow-x-hidden overflow-y-hidden border rounded-xl p-5 bg-amber-50 w-full">
        <div className="flex">
          <Card cardProps={selectionHand.selectedCard} />
        </div>
        <div className="flex flex-col justify-center w-full">
          <p>Select cards</p>
          {selectionHand.selections.map((card) => (
            <div key={card.cardId} onClick={() => onSelectedCardClick(card)}>
              <Card cardProps={card} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-center">
        <div className="flex">
          <p>
            Select {selectionHand.minSelectAmount} to{' '}
            {selectionHand.maxSelectAmount} cards
          </p>
        </div>
        <div className="flex">
          <button type="button"> ok </button>
        </div>
      </div>
    </div>
  );
}
