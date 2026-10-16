import React from 'react';
import { Meteor } from 'meteor/meteor';
import { BossRecapTable } from './BossRecapTable';
import { FINAL_STAGE } from '../../engine/stages';

export function ResultScreen({
  result,
  enemyName,
  bossRecap = [],
  onBackToMenu,
}) {
  const isWin = result === 'win';

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6 px-8 py-6">
      {isWin ? (
        <>
          <h1 style={{ fontFamily: 'var(--game-font)'}} className="text-7xl font-semibold text-yellow-400">Victory!</h1>
          <p style={{ fontFamily: 'var(--game-font)'}} className="text-slate-300 text-2xl">
            You cleared all {FINAL_STAGE} stages and defeated {enemyName}!
          </p>
        </>
      ) : (
        <>
          <h1 style={{ fontFamily: 'var(--game-font)'}} className="text-7xl font-semibold text-red-500">Defeated!</h1>
          <p style={{ fontFamily: 'var(--game-font)'}} className="text-slate-300 text-2xl">
            {enemyName} survived your assault.
          </p>
        </>
      )}

      <BossRecapTable bossRecap={bossRecap} title="Result" />

      <button
        style={{ fontFamily: 'var(--game-font)'}} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-2xl transition-colors"
        onClick={() => Meteor.call('game.newGame')}
      >
        {isWin ? 'Play Again' : 'Try Again'}
      </button>
      <button
        style={{ fontFamily: 'var(--game-font)'}} className="text-slate-400 hover:text-slate-300 text-2xl transition-colors"
        onClick={onBackToMenu}
      >
        Back to Menu
      </button>
      <button
        style={{ fontFamily: 'var(--game-font)'}} className="text-slate-400 hover:text-slate-300 text-2xl transition-colors"
        onClick={() => Meteor.logout()}
      >
        Log Out
      </button>
    </div>
  );
}
