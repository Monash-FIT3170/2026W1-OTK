import React, { useEffect, useState } from 'react';

// Rough timer debuff UI: shows seconds until next tick and a small badge
export default function TimerDebuff({ enemy }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  const hasTimerDebuff = !!enemy.timerDebuffActive || (enemy.debuffs || []).includes('timer');
  if (!hasTimerDebuff) return null;

  let content = <div className="text-[10px] opacity-80">pending</div>;
  if (enemy.timerDebuffActive && enemy.timerDebuffDeadline) {
    const msLeft = Math.max(0, enemy.timerDebuffDeadline - now);
    const secondsLeft = Math.ceil(msLeft / 1000);
    content = <div className="text-[10px] opacity-80">{secondsLeft}s</div>;
  }

  return (
    <div className="absolute right-0 top-0 flex items-center pointer-events-none">
      <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center space-x-2">
        <svg className="w-4 h-4 text-cyan-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="9" strokeWidth="2"></circle>
          <path d="M12 7v6l4 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
        <div>
          <div className="font-semibold">Timer</div>
          {content}
        </div>
      </div>
    </div>
  );
}
