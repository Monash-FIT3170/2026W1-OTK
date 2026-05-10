import { Card } from './Card';
import { motion } from 'framer-motion';

export function SelectionPanel({ selectionHand }) {
  const selections = Object.entries(selectionHand);
  const onSelectedCardClick = (card) => {
    selectionHand.removeSelection(card);
  };
  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col justify-center w-1/2">
        <p className="flex justify-center mb-1">Select cards</p>
        <div className="flex flex-row ">
          <div className="flex min-h-70 justify-center p-5 w-4/10 ">
            <Card cardProps={selectionHand.selectedCard} />
          </div>
          <div className="flex flex-col justify-center overflow-x-hidden overflow-y-hidden border rounded-xl p-5 bg-gray-70 w-8/10">
            {selectionHand.selections.map((card) => (
              <div key={card.cardId} onClick={() => onSelectedCardClick(card)}>
                <Card cardProps={card} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-row justify-center m-2">
          <div className="flex mt-1">
            <p>
              Select {selectionHand.minSelectAmount} to {' '}
              {selectionHand.maxSelectAmount} cards
            </p>
          </div>
          <div className="flex ml-5">
            <button type="button" className="text-body bg-neutral-secondary-medium box-border border border-default-medium 
            hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium 
            leading-5 rounded-full text-sm px-4 py-1.5 focus:outline-none disabled:bg-gray-400" 
            disabled={selectionHand.isSelectableAmount()}> ok </button>
          </div>
        </div>
      </div>
      </div>
  );
}
