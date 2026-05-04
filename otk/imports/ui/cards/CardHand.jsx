import Card from './Card';
import { motion } from 'motion/react';

export default function CardHand({ cards }) {
  const cardArray = Object.values(cards);
  const numCards = cardArray.length;

  const cardWidth = 176;
  const containerWidth = window.innerWidth - 40;

  const marginLeft =
    numCards > 1
      ? -Math.max(0, (cardWidth * numCards - containerWidth) / (numCards - 1))
      : 0;

  return (
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
  );
}
