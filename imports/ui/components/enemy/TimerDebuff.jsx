import React, { useEffect, useRef, useState } from 'react';

// Countdown orb that floats above the enemy's head while the timer debuff is
// ticking. When it reaches zero the engine heals the enemy and clears the debuff.
//
// enemy.timerDebuffDeadline is an absolute timestamp stamped with the *server's*
// clock. Counting it down against the browser's Date.now() breaks on deployments
// where the two machines' clocks differ - the countdown then starts wherever the
// offset lands (the Railway "always starts at 2, holds on 0" bug). Instead we
// derive a clock offset from lastActiveAt, a server timestamp the battle-screen
// heartbeat (game.applyTimerTick) refreshes every ~2s, and count down against
// that estimated server time.
export default function TimerDebuff({ enemy, lastActiveAt }) {
  const [now, setNow] = useState(Date.now());

  // serverOffset ~= serverNow - clientNow, refreshed whenever the heartbeat
  // delivers a new server timestamp. One-way transit latency (tens of ms) is
  // ignored - negligible next to the multi-second clock skew this corrects.
  const serverOffsetRef = useRef(0);
  useEffect(() => {
    if (typeof lastActiveAt === 'number') {
      serverOffsetRef.current = lastActiveAt - Date.now();
    }
  }, [lastActiveAt]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  // Only show the countdown while it is actually running (the engine leaves it
  // inactive until the boss has taken damage worth healing).
  if (!enemy.timerDebuffActive || !enemy.timerDebuffDeadline) return null;

  const serverNow = now + serverOffsetRef.current;
  const msLeft = Math.max(0, enemy.timerDebuffDeadline - serverNow);
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
