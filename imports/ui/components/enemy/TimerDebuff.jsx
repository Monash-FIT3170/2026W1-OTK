import React, { useEffect, useState } from 'react';

// Countdown orb that floats above the enemy's head while the timer debuff is
// ticking. When it reaches zero the engine heals the enemy and clears the debuff.
export default function TimerDebuff({ enemy }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  // Only show the countdown while it is actually running (the engine leaves it
  // inactive until the boss has taken damage worth healing).
  if (!enemy.timerDebuffActive || !enemy.timerDebuffDeadline) return null;

  const msLeft = Math.max(0, enemy.timerDebuffDeadline - now);
  const label = String(Math.ceil(msLeft / 1000));

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
