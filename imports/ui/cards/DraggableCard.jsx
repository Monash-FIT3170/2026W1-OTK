// DraggableCard.jsx
import { useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'motion/react';
import Card from './Card';
import { soundManager } from '../soundManager';

export function DraggableCard({
  cardProps,
  marginLeft,
  onClick,
  handRef,
  onPlay,
  isInSelectionMode = false,
  affordable = true,
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);

  const isOutsideHand = () => {
    if (!handRef?.current || !cardRef?.current) return false;
    const hand = handRef.current.getBoundingClientRect();
    const card = cardRef.current.getBoundingClientRect();
    return card.bottom < hand.top;
  };

  const handleDragEnd = () => {
    if (isOutsideHand() && affordable) {
      onPlay(cardProps.uniqueId);
    }
    animate(x, 0, { type: 'spring', stiffness: 300, damping: 20 });
    animate(y, 0, {
      type: 'spring',
      stiffness: 300,
      damping: 20,
      onComplete: () => setIsDragging(false),
    });
  };

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: !affordable && !isInSelectionMode ? 0.4 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ marginLeft }}
    >
      <motion.div
        ref={cardRef}
        style={{ x, y }}
        onClick={onClick}
        onHoverStart={() => !isDragging && soundManager.playCardHover()}
        drag={!isInSelectionMode}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        dragMomentum={false}
        dragElastic={0}
      >
        <Card cardProps={cardProps} isDragging={isDragging} />
      </motion.div>
    </motion.div>
  );
}
