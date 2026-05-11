// DraggableCard.jsx
import { motion, useMotionValue, animate } from 'framer-motion';
import  Card from './Card';

export function DraggableCard({ cardProps, marginLeft, onClick, handRef, onPlay }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleDragEnd = () => {
      if (isOutsideHand()) {
        console.log('Playing card:', cardProps.name);
        // onPlay(cardProps.uniqueCardId);
      }
      // Animate back to origin
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 20 });
      animate(y, 0, { type: 'spring', stiffness: 300, damping: 20 });
    };

  const cardRef = useRef(null);

  const isOutsideHand = () => {
    if (!handRef?.current || !cardRef?.current) return false;
    const hand = handRef.current.getBoundingClientRect();
    const card = cardRef.current.getBoundingClientRect();
    return card.bottom < hand.top;
  };

  return (
    <motion.div
      style={{ marginLeft, x, y }}
      onClick={onClick}
      drag
      onDragEnd={handleDragEnd}
      dragMomentum={false}
    >
      <Card cardProps={cardProps} />
    </motion.div>
  );
}