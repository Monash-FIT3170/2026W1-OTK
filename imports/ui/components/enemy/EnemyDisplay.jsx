import { motion, AnimatePresence, useAnimate } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { EntryAnimations, HitAnimations } from './EnemyAnimations';
import TimerDebuff from './TimerDebuff';
import ShieldLayers from './ShieldDisplay';
import { soundManager } from '../../soundManager';
import { Evasion } from '../../../engine/debuffs/Evasion';
import { Inflation } from '../../../engine/debuffs/Inflation';

// Full-screen colour flashes: green when the enemy heals, the Merchant's
// dark purple when its inflation raises card costs. A dark colour would
// barely show through mix-blend-screen, so that one is laid over normally.
const FLASH_COLOURS = {
  heal: 'bg-green-400 mix-blend-screen',
  inflation: 'bg-purple-900',
};

const ENEMY_SPRITE_IDS = {
  trainingdummy: 'goblin',
  frostwarden: 'dragon',
  timekeeper: 'lion',
  undying: 'turtle',
  ninja: 'ninja',
  merchant: 'merchant',
  secretboss: 'secretBoss',
};

const ENEMY_SPRITE_SIZES = {
  goblin: 'h-70',
  ninja: 'h-100',
  dragon: 'h-100',
  lion: 'h-100',
  secretBoss: 'h-55',
  turtle: 'h-80',
  merchant: 'h-80',
};

const ENEMY_SPRITE_OFFSETS = {
  dragon: 'translate-x-100',
  lion: 'translate-x-35 translate-y-10',
  turtle: '-translate-x-20 translate-y-17',
  merchant: 'translate-y-10',
};

// Supported animation states for sprites with incomplete animation sets.
const ENEMY_SPRITE_STATES = {
  ninja: ['idle', 'hit', 'dodge'],
  lion: ['idle'],
  secretBoss: ['idle', 'hit'],
  turtle: ['idle'],
  merchant: ['idle'],
};

export function EnemyDisplay({
  enemy,
  isVisible,
  lastActiveAt,
  cardsUsed,
  _useAnimate = useAnimate,
}) {
  if (!enemy) return null;

  const [scope, animate] = _useAnimate();
  const [spriteState, setSpriteState] = useState('entry'); // 'entry' | 'idle' | 'hit' | 'dodge' | 'die'
  const [flashOn, setFlashOn] = useState(false);
  // Kept after the flash ends so it fades out in the same colour
  const [flashColour, setFlashColour] = useState(FLASH_COLOURS.heal);
  const triggerFlash = (kind) => {
    setFlashColour(FLASH_COLOURS[kind]);
    setFlashOn(true);
  };
  const prevHealthRef = useRef(null);
  const prevCardsUsedRef = useRef(null);
  const prevDamageTakenCountRef = useRef(null);
  const entryTimerRef = useRef(null);
  const dodgeTimerRef = useRef(null);

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
    const damageTakenCount = enemy.damageTakenCount ?? 0;
    const damageWasEvaded =
      prevDamageTakenCountRef.current !== null &&
      damageTakenCount > prevDamageTakenCountRef.current &&
      hp === prevHealthRef.current;

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
      } else if (hp > prevHealthRef.current) {
        // Timer debuff healed the enemy: green fade + gong.
        triggerFlash('heal');
        soundManager.playGong();
      } else if (
        damageWasEvaded &&
        enemy.enemyId === 'ninja' &&
        enemy.debuffs.includes('evasion')
      ) {
        clearTimeout(dodgeTimerRef.current);
        setSpriteState('dodge');
        soundManager.playSwoosh();
        dodgeTimerRef.current = setTimeout(() => {
          setSpriteState((current) => (current === 'dodge' ? 'idle' : current));
        }, 1000);
      }
    }

    prevHealthRef.current = hp;
    prevDamageTakenCountRef.current = damageTakenCount;
  }, [enemy.currentHealth, enemy.damageTakenCount]);

  useEffect(() => () => clearTimeout(dodgeTimerRef.current), []);

  // Tell the sound manager ahead of time when the next hit will be dodged,
  // so the attack's own sound is skipped and only the swoosh plays.
  useEffect(() => {
    soundManager.setEnemyEvadesNextHit(Evasion.evadesNextHit(enemy));
  }, [enemy.enemyId, enemy.damageTakenCount, enemy.debuffs?.join()]);

  useEffect(() => () => soundManager.setEnemyEvadesNextHit(false), []);

  // Merchant's inflation raised card costs: gold flash + coin sound.
  useEffect(() => {
    if (cardsUsed === undefined) return;
    if (
      prevCardsUsedRef.current !== null &&
      cardsUsed > prevCardsUsedRef.current &&
      enemy.debuffs.includes('inflation') &&
      Inflation.raisedCostsAt(cardsUsed)
    ) {
      triggerFlash('inflation');
      soundManager.playCoinUp();
    }
    prevCardsUsedRef.current = cardsUsed;
  }, [cardsUsed]);

  // Clear the flash after it fades in.
  useEffect(() => {
    if (!flashOn) return;
    const id = setTimeout(() => setFlashOn(false), 900);
    return () => clearTimeout(id);
  }, [flashOn]);

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
    dodge: '-dodge',
    die: '-die',
    idle: '',
  };
  const availableStates = ENEMY_SPRITE_STATES[spriteId];
  const effectiveState =
    availableStates && !availableStates.includes(spriteState)
      ? 'idle'
      : spriteState;
  const suffix = STATE_SUFFIXES[effectiveState] ?? '';
  const spriteFilename =
    spriteId === 'ninja'
      ? `ninja${suffix}-enemy.gif`
      : normalizedId === 'secretboss'
        ? `secretBoss-${effectiveState === 'hit' ? 'attack' : 'idle'}-enemy.gif`
        : `${spriteId}${suffix}-enemy.gif`;
  const isSecretBossDying = normalizedId === 'secretboss' && spriteState === 'die';

  return (
    <>
      <div
        className={`pointer-events-none fixed inset-0 z-50 ${flashColour} transition-opacity duration-700`}
        style={{ opacity: flashOn ? 0.6 : 0 }}
      />
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
              src={`/assets/sprites/enemies/${spriteFilename}`}
              alt={enemy.name}
              className={`${spriteSizeClass} ${spriteOffsetClass} w-auto object-contain transition-transform`}
              style={{
                imageRendering: 'pixelated',
                transform:
                  normalizedId === 'secretboss'
                    ? isSecretBossDying
                      ? 'scaleX(-1) scale(1.08) translateY(-8px)'
                      : 'scaleX(-1)'
                    : undefined,
                filter: isSecretBossDying ? 'brightness(0) blur(5px)' : undefined,
                opacity: isSecretBossDying ? 0 : 1,
                transition:
                  normalizedId === 'secretboss'
                    ? 'opacity 1.2s ease, filter 1.2s ease, transform 1.2s ease'
                    : undefined,
              }}
              onError={(e) => {
                const target = e.currentTarget;
                const idleGif =
                  normalizedId === 'secretboss'
                    ? '/assets/sprites/enemies/secretBoss-idle-enemy.gif'
                    : `/assets/sprites/enemies/${spriteId}-enemy.gif`;
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
              <ShieldLayers enemy={enemy} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
