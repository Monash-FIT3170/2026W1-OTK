// DraggableCard.jsx
import { motion, useMotionValue, animate } from 'framer-motion';
import { Card } from './Card';

export function DraggableCard({ card, marginLeft, onClick }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleDragEnd = () => {
    animate(x, 0, { type: 'spring', stiffness: 300, damping: 20 });
    animate(y, 0, { type: 'spring', stiffness: 300, damping: 20 });
  };

  return (
    <motion.div
      style={{ marginLeft, x, y }}
      onClick={onClick}
      drag
      onDragEnd={handleDragEnd}
      dragMomentum={false}
    >
      <Card cardProps={card} />
    </motion.div>
  );
}