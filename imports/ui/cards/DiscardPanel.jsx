import Card from './Card';
import { motion } from 'motion/react';

export default function DiscardPanel({ CardHand: cardHand, discardHand }) {
    const cardHand = Object.entries(cardHand);
    const discardHand = Object.entries(discardHand);

  return (
    <div className="flex flex-row overflow-x-hidden overflow-y-hidden border rounded-xl p-5 bg-amber-50 w-full">
      <div className="flex flex-row justify-center w-full">
            discardHand.map(([cardId, card]) => (
                <
            )
        <p>discard cards</p>
        <button onClick={onConfirm} className="px-5 py-2 bg-red-600 text-white font-bold rounded-xl">Done</button>
      </div>

      <div className="flex flex-row justify-center w-full">
        <p>hand</p>
      </div>
    </div>
  );
}
