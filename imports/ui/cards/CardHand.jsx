import { useRef } from 'react';
import Card from './Card';
import { motion } from 'motion/react';
import { usePlayCard } from '../hooks/usePlayCard';

export default function CardHand({ cards }) {
  const handRef = useRef(null);
  const cardArray = Object.values(cards);
  const numCards = cardArray.length;

  const cardWidth = 176;
  const containerWidth = window.innerWidth - 40;

  const marginLeft =
    numCards > 1
      ? -Math.max(0, (cardWidth * numCards - containerWidth) / (numCards - 1))
      : 0;

  const { onPlay, pendingSelection, confirmSelection } = usePlayCard();

  return (
    <div
      ref={handRef}
      className="flex flex-row border rounded-xl p-5 bg-amber-50 w-full"
    >
      {/* {pendingSelection && <SelectionUI onConfirm={confirmSelection} />} */}
      <div className="flex flex-row justify-center w-full">
        {cardArray.map((card, idx) => (
          <motion.div
            style={{ marginLeft: idx !== 0 ? `${marginLeft}px` : '0px' }}
          >
            <Card cardProps={card} handRef={handRef} onPlay={onPlay} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
