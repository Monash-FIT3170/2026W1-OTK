import { motion, AnimatePresence } from 'motion/react';

export function EnemyDisplay({ enemy, isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={enemy.enemyId}
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <img 
          // EnemyDisplay.jsx - fix the src string
            src={`/assets/sprites/enemies/${enemy.name.toLowerCase()}-enemy.png`}
            alt={enemy.name}
          />
          <h2>{enemy.name}</h2>
          <p>HP: {enemy.health}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}