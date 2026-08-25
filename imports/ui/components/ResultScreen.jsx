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
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6">
      {isWin ? (
        <>
          <h1 className="text-5xl font-bold text-yellow-400">Victory!</h1>
          <p className="text-slate-300 text-lg">
            You cleared all {FINAL_STAGE} stages and defeated {enemyName}!
          </p>
        </>
      ) : (
        <>
          <h1 className="text-5xl font-bold text-red-500">Defeated!</h1>
          <p className="text-slate-300 text-lg">
            {enemyName} survived your assault.
          </p>
        </>
      )}

      <BossRecapTable bossRecap={bossRecap} title="Result" />

      <button
        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-lg transition-colors"
        onClick={() => Meteor.call('game.newGame')}
      >
        {isWin ? 'Play Again' : 'Try Again'}
      </button>
      <button
        className="text-slate-400 hover:text-slate-300 text-sm transition-colors"
        onClick={onBackToMenu}
      >
        Back to Menu
      </button>
      <button
        className="text-slate-400 hover:text-slate-300 text-sm transition-colors"
        onClick={() => Meteor.logout()}
      >
        Log Out
      </button>
    </div>
  );
}
