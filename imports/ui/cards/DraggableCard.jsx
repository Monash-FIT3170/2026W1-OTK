// DraggableCard.jsx
import { useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'motion/react';
import Card from './Card';
import { soundManager } from '../soundManager';
import { useGameScale } from '../GameScaleContext';

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
  const gameScale = useGameScale();

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

  const handlePanStart = () => {
    if (!isInSelectionMode) setIsDragging(true);
  };

  const handlePan = (e, info) => {
    if (isInSelectionMode) return;
    const s = gameScale?.get() ?? 1;
    x.set(x.get() + info.delta.x / s);
    y.set(y.get() + info.delta.y / s);
  };

  const handlePanEnd = () => {
    if (!isInSelectionMode) handleDragEnd();
  };

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ marginLeft, flexShrink: 0 }}
    >
      <motion.div
        ref={cardRef}
        style={{
          x,
          y,
          position: 'relative',
          touchAction: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        whileHover={!isDragging ? { scale: 1.1 } : {}}
        onClick={onClick}
        onHoverStart={() => !isDragging && soundManager.playCardHover()}
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
      >
        <Card cardProps={cardProps} />
        {!affordable && !isInSelectionMode && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.55)',
              pointerEvents: 'none',
              maskImage: `url(/assets/sprites/cards/${cardProps.cardId}.png)`,
              maskSize: '100% 100%',
              maskRepeat: 'no-repeat',
              WebkitMaskImage: `url(/assets/sprites/cards/${cardProps.cardId}.png)`,
              WebkitMaskSize: '100% 100%',
              WebkitMaskRepeat: 'no-repeat',
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
