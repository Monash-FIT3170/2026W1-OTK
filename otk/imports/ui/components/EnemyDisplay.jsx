import { motion, AnimatePresence, useAnimate } from 'motion/react';
import { useEffect, useState } from 'react';
import { EntryAnimations, HitAnimations } from './EnemyAnimations';


/**
 * Displays an enemy with entrance, exit, and damage animations.
 * The image used must be named in the format: [enemy-name]-enemy.png and placed in the /assets/sprites/enemies/ directory.
 * For example, a Goblin enemy would require an image named goblin-enemy.png.
 *
 * @component
 * @param {Enemy} enemy - The enemy instance
 * @param {boolean} isVisible - Controls whether the enemy is rendered. Setting to false triggers the exit animation.
 * @param {boolean} isTakingDamage - When toggled to true, triggers a shake animation
 *
 */
export function EnemyDisplay({ enemy, isVisible, isTakingDamage, _useAnimate = useAnimate }) {
  const [scope, animate] = _useAnimate();

  // Used to swap out the hit sprite when taking damage. Resets to normal sprite after animation completes.
  const [isHit, setIsHit] = useState(false);

  // Trigger hit animation when isTakingDamage becomes true
  useEffect(() => {
    if (isTakingDamage) {
      setIsHit(true);
      const { keyframes, options } = HitAnimations[enemy.constructor.hitAnimation];
      animate(scope.current, keyframes, options).then(() => setIsHit(false)); // Reset hit state after animation completes
    }
  }, [isTakingDamage]);

  const { initial, animate: animateProps, exit, transition } = EntryAnimations[enemy.constructor.entryAnimation];

  return (
    <AnimatePresence>
      {isVisible && (
        // Renders the Enemy on the right side of the screen, centered vertically
        <div style={{ position: 'absolute', left: '75%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          <motion.div
            ref={scope}
            key={enemy.enemyId}
            initial={initial}
            animate={animateProps}
            exit={exit}
            transition={transition}
          >
            <img 
              src={`/assets/sprites/enemies/${enemy.name.toLowerCase()}-enemy${isHit ? '-hit' : ''}.png`}
              alt={enemy.name}
              style={{ width: '150px', height: '150px' }}

              // Triggers when the hit sprite fails to load (e.g. missing file), falls back to normal sprite
              onError={(e) => {
                e.target.src = `/assets/sprites/enemies/${enemy.name.toLowerCase()}-enemy.png`;
              }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}