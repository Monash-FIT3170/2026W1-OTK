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

  const handleDragStart = () => setIsDragging(true);

  const handleDragEnd = () => {
    if (isOutsideHand() && affordable) {
      soundManager.playCardSound(cardProps.cardId);
      onPlay(cardProps.uniqueId);
    }
    // Animate back to origin, then re-enable card hover/tap animations
    animate(x, 0, { type: 'spring', stiffness: 300, damping: 20 });
    animate(y, 0, {
      type: 'spring',
      stiffness: 300,
      damping: 20,
      onComplete: () => setIsDragging(false),
    });
  };

  const cardRef = useRef(null);

  const drawAnimation = {
    initial: { y: 80, opacity: 0 },
    animate: { y: 0, opacity: !affordable && !isInSelectionMode ? 0.4 : 1 },
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  };

  const isOutsideHand = () => {
    if (!handRef?.current || !cardRef?.current) return false;
    const hand = handRef.current.getBoundingClientRect();
    const card = cardRef.current.getBoundingClientRect();
    return card.bottom < hand.top;
  };

  return (
    <motion.div
      ref={cardRef}
      {...drawAnimation}
      style={{
        marginLeft,
        x,
        y,
      }}
      onClick={onClick}
      onHoverStart={() => !isDragging && soundManager.playCardHover()}
      drag={!isInSelectionMode}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      dragMomentum={false}
    >
      <Card cardProps={cardProps} isDragging={isDragging} />
    </motion.div>
  );
}
