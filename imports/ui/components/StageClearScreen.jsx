import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { BossRecapTable } from './BossRecapTable';
import { FINAL_STAGE } from '../../engine/stages';

/**
 * Shown between bosses, once a stage is cleared but the run is not over.
 *
 * This doubles as the run's resume checkpoint: the 'stageCleared' result is
 * persisted, so quitting here and hitting Continue returns to this screen.
 *
 * Deliberately offers no deck-editing entry point - the deck is locked for the
 * duration of a run.
 *
 * @param {number} stage - the stage just cleared
 * @param {string} enemyName - the boss just defeated
 * @param {BossRecapEntry[]} bossRecap - recap entries accumulated so far
 * @param {() => void} onBackToMenu - leave the run (progress is already saved)
 */
export function StageClearScreen({
  stage,
  enemyName,
  bossRecap = [],
  onBackToMenu,
}) {
  const [advancing, setAdvancing] = useState(false);
  const [error, setError] = useState('');

  const handleNextEnemy = () => {
    setAdvancing(true);
    setError('');
    Meteor.call('game.advanceStage', (err) => {
      setAdvancing(false);
      if (err) {
        console.error('game.advanceStage failed:', err);
        setError(err.reason || 'Could not start the next stage.');
      }
      // On success the reactive gameState flips result back to 'playing' and
      // App.jsx renders the battle screen - nothing to do here.
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6">
      <h1 className="text-5xl font-bold text-emerald-400">
        Stage {stage} Cleared!
      </h1>
      <p className="text-slate-300 text-lg">
        You defeated {enemyName}. {FINAL_STAGE - stage} to go.
      </p>

      <BossRecapTable bossRecap={bossRecap} title="Run so far" />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-lg transition-colors disabled:opacity-50"
        onClick={handleNextEnemy}
        disabled={advancing}
      >
        {advancing ? 'Starting...' : 'Next Enemy'}
      </button>
      <button
        className="text-slate-400 hover:text-slate-300 text-sm transition-colors"
        onClick={onBackToMenu}
      >
        Back to Menu
      </button>
      <p className="text-slate-500 text-xs">
        Your progress is saved - Continue from the menu returns you here.
      </p>
    </div>
  );
}
