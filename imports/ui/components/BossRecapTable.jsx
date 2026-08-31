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
 */
export function BossRecapTable({ bossRecap = [], title = 'Result' }) {
  if (bossRecap.length === 0) return null;

  const totalTimeMs = bossRecap.reduce((sum, entry) => sum + entry.timeMs, 0);
  const totalCards = bossRecap.reduce((sum, entry) => sum + entry.cardsUsed, 0);

  return (
    <div
      className="border border-slate-500 rounded-lg px-8 py-6 w-full max-w-2xl"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      {/* Header row */}
      <div className="flex items-baseline mb-1">
        <span className="text-slate-200 text-lg font-semibold">{title}</span>
      </div>
      <div className="border-t border-slate-500 mb-4" />

      {/* Column headers */}
      <div className="flex items-center mb-3">
        <div className="flex-1" />
        <div className="w-36 text-center text-slate-300 text-sm font-semibold">
          Time
        </div>
        <div className="w-36 text-center text-slate-300 text-sm font-semibold">
          Cards Used
        </div>
      </div>

      {/* Boss rows */}
      {bossRecap.map((entry, idx) => (
        <div key={idx} className="flex items-center mb-3">
          <div className="flex-1">
            <span className="inline-block border border-slate-400 rounded px-4 py-1.5 text-slate-200 text-sm">
              {entry.bossName}
            </span>
          </div>
          <div className="w-36 flex justify-center">
            <span className="inline-block border border-slate-400 rounded px-4 py-1.5 text-slate-200 text-sm">
              {formatTime(entry.timeMs)}
            </span>
          </div>
          <div className="w-36 flex justify-center">
            <span className="inline-block border border-slate-400 rounded px-4 py-1.5 text-slate-200 text-sm">
              {entry.cardsUsed}
            </span>
          </div>
        </div>
      ))}

      {/* Divider before totals */}
      <div className="border-t border-slate-500 my-4" />

      {/* Totals row */}
      <div className="flex items-center">
        <div className="flex-1">
          <span className="text-slate-200 text-sm font-semibold">Total</span>
        </div>
        <div className="w-36 flex justify-center">
          <span className="inline-block border border-slate-400 rounded px-4 py-1.5 text-slate-200 text-sm">
            {formatTime(totalTimeMs)}
          </span>
        </div>
        <div className="w-36 flex justify-center">
          <span className="inline-block border border-slate-400 rounded px-4 py-1.5 text-slate-200 text-sm">
            {totalCards}
          </span>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="border-t border-slate-500 mt-4" />
    </div>
  );
}
