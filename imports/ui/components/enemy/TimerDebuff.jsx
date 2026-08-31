import React, { useEffect, useState } from 'react';

// Countdown orb that floats above the enemy's head while the timer debuff is
// ticking. When it reaches zero the engine heals the enemy and clears the debuff.
export default function TimerDebuff({ enemy }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  const hasTimerDebuff =
    !!enemy.timerDebuffActive || (enemy.debuffs || []).includes('timer');
  if (!hasTimerDebuff) return null;

  let label = '';
  if (enemy.timerDebuffActive && enemy.timerDebuffDeadline) {
    const msLeft = Math.max(0, enemy.timerDebuffDeadline - now);
    label = String(Math.ceil(msLeft / 1000));
  }

  // Roughly above the lion's head; dimensions/placement to be tuned.
  return (
    <div className="pointer-events-none absolute left-80 -top-12 -translate-x-1/2">
      <div className="relative h-50 w-50">
        <img
          src="/assets/sprites/enemies/orb.png"
          alt=""
          className="h-full w-full object-contain"
          style={{ imageRendering: 'pixelated' }}
        />
        <span
          className="absolute inset-0 flex items-center justify-center text-white text-6xl leading-none"
          style={{
            fontFamily: '"Micro 5", monospace',
            transform: 'translateY(-5%)',
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
