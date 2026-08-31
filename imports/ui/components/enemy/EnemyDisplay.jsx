import { motion, AnimatePresence, useAnimate } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { EntryAnimations, HitAnimations } from './EnemyAnimations';
import TimerDebuff from './TimerDebuff';

const ENEMY_SPRITE_IDS = {
  trainingdummy: 'goblin',
  frostwarden: 'dragon',
  timekeeper: 'lion',
};

const ENEMY_SPRITE_SIZES = {
  goblin: 'h-70',
  dragon: 'h-100',
  lion: 'h-100',
};

const ENEMY_SPRITE_OFFSETS = {
  dragon: 'translate-x-100',
  lion: 'translate-x-35 translate-y-10',
};

// Sprites that only ship an idle GIF. Every state resolves to idle rather
// than requesting a file that will 404 into the onError cascade below.
const ENEMY_SPRITE_STATES = {
  lion: ['idle'],
};

export function EnemyDisplay({ enemy, isVisible, _useAnimate = useAnimate }) {
  if (!enemy) return null;

  const [scope, animate] = _useAnimate();
  const [spriteState, setSpriteState] = useState('entry'); // 'entry' | 'idle' | 'hit' | 'die'
  const prevHealthRef = useRef(null);
  const entryTimerRef = useRef(null);

  // 1. Play Entry sprite on mount / enemy change, then transition to Idle
  useEffect(() => {
    setSpriteState('entry');
    entryTimerRef.current = setTimeout(() => {
      setSpriteState('idle');
    }, 1500); // Match entry animation duration (1s)

    return () => clearTimeout(entryTimerRef.current);
  }, [enemy.enemyId]);

  // 2. Play Hit or Die sprites based on health changes
  useEffect(() => {
    const hp = enemy.currentHealth;

    if (prevHealthRef.current !== null) {
      if (hp <= 0) {
        setSpriteState('die');
      } else if (hp < prevHealthRef.current) {
        setSpriteState('hit');
        const { keyframes, options } =
          HitAnimations[enemy.hitAnimation] ?? HitAnimations.knockback;

        animate(scope.current, keyframes, options).then(() => {
          setSpriteState((current) => (current === 'hit' ? 'idle' : current));
        });
      }
    }

    prevHealthRef.current = hp;
  }, [enemy.currentHealth]);

  const {
    initial,
    animate: animateProps,
    exit,
    transition,
  } = EntryAnimations[enemy.entryAnimation] ?? EntryAnimations.fade;

  const normalizedId = enemy.enemyId ? enemy.enemyId.toLowerCase() : '';
  const spriteId = ENEMY_SPRITE_IDS[normalizedId] || normalizedId;
  const spriteSizeClass = ENEMY_SPRITE_SIZES[spriteId] || 'h-48';
  const spriteOffsetClass = ENEMY_SPRITE_OFFSETS[spriteId] || '';

  // Maps current state to file suffix
  const STATE_SUFFIXES = {
    entry: '-entry',
    hit: '-attack',
    die: '-die',
    idle: '',
  };
  const availableStates = ENEMY_SPRITE_STATES[spriteId];
  const effectiveState =
    availableStates && !availableStates.includes(spriteState)
      ? 'idle'
      : spriteState;
  const suffix = STATE_SUFFIXES[effectiveState] ?? '';

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
              src={`/assets/sprites/enemies/${spriteId}${suffix}-enemy.gif`}
              alt={enemy.name}
              className={`${spriteSizeClass} ${spriteOffsetClass} w-auto object-contain transition-transform`}
              style={{ imageRendering: 'pixelated' }}
              onError={(e) => {
                const target = e.currentTarget;
                const idleGif = `/assets/sprites/enemies/${spriteId}-enemy.gif`;
                const idlePng = `/assets/sprites/enemies/${spriteId}-enemy.png`;

                // If specialized state GIF fails (e.g., dragon-entry-enemy.gif), fall back to idle GIF
                if (
                  !target.src.endsWith(`${spriteId}-enemy.gif`) &&
                  !target.src.endsWith(`${spriteId}-enemy.png`)
                ) {
                  target.src = idleGif;
                  return;
                }
                // Fall back to PNG if GIF is missing
                if (target.src.endsWith('.gif')) {
                  target.src = idlePng;
                  return;
                }

                target.onerror = null;
                target.src = '/assets/sprites/enemies/placeholder-enemy.png';
              }}
            />
            <TimerDebuff enemy={enemy} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
