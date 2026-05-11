// DraggableCard.jsx
import { useRef } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import  Card from './Card';

export function DraggableCard({ cardProps, marginLeft, onClick, handRef, onPlay, draggable = true }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleDragEnd = () => {
      if (isOutsideHand()) {
        onPlay(cardProps.uniqueId);
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
      ref={cardRef}
      style={{ marginLeft, x, y }}
      onClick={onClick}
      drag={draggable}
      onDragEnd={handleDragEnd}
      dragMomentum={false}
    >
      <Card cardProps={cardProps} />
    </motion.div>
  );
}