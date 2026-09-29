import React from 'react';

/**
 * Formats milliseconds into a mm:ss string.
 */
export function formatTime(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * One row per boss fought so far, plus a totals row.
 *
 * Shared by the end-of-run ResultScreen and the between-stages
 * StageClearScreen, which show the same running recap at different points.
 *
 * @param {BossRecapEntry[]} bossRecap - accumulated recap entries for the run
 * @param {string} title - heading shown above the table
 * @param {boolean} compact - tighter padding/text, for screens sharing width
 *   with other content (e.g. StageClearScreen's power-up choices)
 */
export function BossRecapTable({ bossRecap = [], title = 'Result', compact = false }) {
  if (bossRecap.length === 0) return null;

  const totalTimeMs = bossRecap.reduce((sum, entry) => sum + entry.timeMs, 0);
  const totalCards = bossRecap.reduce((sum, entry) => sum + entry.cardsUsed, 0);

  const colWidth = compact ? 'w-20' : 'w-36';
  const cellText = compact ? 'text-xs' : 'text-sm';
  const cellPad = compact ? 'px-2 py-1' : 'px-4 py-1.5';

  return (
    <div
      className={`border border-slate-500 rounded-lg w-full max-w-2xl ${compact ? 'px-4 py-3' : 'px-8 py-6'}`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      {/* Header row */}
      <div className="flex items-baseline mb-1">
        <span className={`text-slate-200 font-semibold ${compact ? 'text-sm' : 'text-lg'}`}>{title}</span>
      </div>
      <div className={`border-t border-slate-500 ${compact ? 'mb-2' : 'mb-4'}`} />

      {/* Column headers */}
      <div className={`flex items-center ${compact ? 'mb-2' : 'mb-3'}`}>
        <div className="flex-1" />
        <div className={`${colWidth} text-center text-slate-300 ${cellText} font-semibold`}>
          Time
        </div>
        <div className={`${colWidth} text-center text-slate-300 ${cellText} font-semibold`}>
          Cards Used
        </div>
      </div>

      {/* Boss rows */}
      {bossRecap.map((entry, idx) => (
        <div key={idx} className={`flex items-center ${compact ? 'mb-2' : 'mb-3'}`}>
          <div className="flex-1">
            <span className={`inline-block border border-slate-400 rounded text-slate-200 ${cellText} ${cellPad}`}>
              {entry.bossName}
            </span>
          </div>
          <div className={`${colWidth} flex justify-center`}>
            <span className={`inline-block border border-slate-400 rounded text-slate-200 ${cellText} ${cellPad}`}>
              {formatTime(entry.timeMs)}
            </span>
          </div>
          <div className={`${colWidth} flex justify-center`}>
            <span className={`inline-block border border-slate-400 rounded text-slate-200 ${cellText} ${cellPad}`}>
              {entry.cardsUsed}
            </span>
          </div>
        </div>
      ))}

      {/* Divider before totals */}
      <div className={`border-t border-slate-500 ${compact ? 'my-2' : 'my-4'}`} />

      {/* Totals row */}
      <div className="flex items-center">
        <div className="flex-1">
          <span className={`text-slate-200 font-semibold ${cellText}`}>Total</span>
        </div>
        <div className={`${colWidth} flex justify-center`}>
          <span className={`inline-block border border-slate-400 rounded text-slate-200 ${cellText} ${cellPad}`}>
            {formatTime(totalTimeMs)}
          </span>
        </div>
        <div className={`${colWidth} flex justify-center`}>
          <span className={`inline-block border border-slate-400 rounded text-slate-200 ${cellText} ${cellPad}`}>
            {totalCards}
          </span>
        </div>
      </div>

      {/* Bottom divider */}
      <div className={`border-t border-slate-500 ${compact ? 'mt-2' : 'mt-4'}`} />
    </div>
  );
}

