import { motion, AnimatePresence, useAnimate } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { EntryAnimations, HitAnimations } from './EnemyAnimations';
import TimerDebuff from './TimerDebuff';

/**
 * Displays an enemy with entrance, exit, and damage animations.
 * The image used must be named in the format: [enemy-name]-enemy.png and placed in the /assets/sprites/enemies/ directory.
 * For example, a Goblin enemy would require an image named goblin-enemy.png.
 *
 * @component
 * @param {Enemy} enemy - The enemy instance
 * @param {boolean} isVisible - Controls whether the enemy is rendered. Setting to false triggers the exit animation.
 *
 */
export function EnemyDisplay({ enemy, isVisible, _useAnimate = useAnimate }) {
  if (!enemy) {
    return (
      <div className="h-48 w-48 flex items-center justify-center bg-red-200 text-sm text-red-800">
        No enemy
      </div>
    );
  }
  const [scope, animate] = _useAnimate();

  // Used to swap out the hit sprite when taking damage. Resets to normal sprite after animation completes.
  const [isHit, setIsHit] = useState(false);

  // Track previous HP to detect damage and trigger hit animation directly
  const prevHealthRef = useRef(null);

  useEffect(() => {
    const hp = enemy.currentHealth;
    if (prevHealthRef.current !== null && hp < prevHealthRef.current) {
      setIsHit(true);
      const { keyframes, options } =
        HitAnimations[enemy.hitAnimation] ?? HitAnimations.knockback;
      animate(scope.current, keyframes, options).then(() => setIsHit(false));
    }
    prevHealthRef.current = hp;
  }, [enemy.currentHealth]);

  const {
    initial,
    animate: animateProps,
    exit,
    transition,
  } = EntryAnimations[enemy.entryAnimation] ?? EntryAnimations.fade;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={scope}
          key={enemy.enemyId}
          initial={initial}
          animate={animateProps}
          exit={exit}
          transition={transition}
        >
          <div className="relative inline-block">
          <img
            src={`/assets/sprites/enemies/${enemy.enemyId.toLowerCase()}${isHit ? '-attack' : ''}-enemy.gif`}
            alt={enemy.name}
            className="h-48 w-auto object-contain"
            style={{ imageRendering: 'pixelated' }}
            onError={(e) => {
              e.target.src = `/assets/sprites/enemies/${enemy.name.toLowerCase()}-enemy.png`;
            }}
          />
          {/* Timer debuff badge overlay */}
          <TimerDebuff enemy={enemy} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
