import { Card } from './Card';
import { motion } from 'framer-motion';

export function SelectionPanel({ selectionHand }) {
  const selections = Object.entries(selectionHand);
  const onSelectedCardClick = (card) => {
    selectionHand.removeSelection(card);
  };
  return (
    <div className="flex flex-row overflow-x-hidden overflow-y-hidden border rounded-xl p-5 bg-amber-50 w-full">
      <div className="flex flex-row justify-center w-full">
        <p>Select cards</p>
        {selectionHand.selections.map((card) => (
          <div key={card.cardId} onClick={() => onSelectedCardClick(card)}>
            <Card cardProps={card} />
          </div>
        ))}
      </div>
    </div>
  );
}
