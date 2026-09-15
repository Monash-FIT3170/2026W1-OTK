import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { BossRecapTable } from './BossRecapTable';
import { PowerUpChoices } from './powerups/PowerUpChoices';
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
 * @param {string[]} powerUpChoices - powerUpIds offered as this stage's reward
 * @param {() => void} onBackToMenu - leave the run (progress is already saved)
 */
export function StageClearScreen({
  stage,
  enemyName,
  bossRecap = [],
  powerUpChoices = [],
  onBackToMenu,
}) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [advancing, setAdvancing] = useState(false);
  const [error, setError] = useState('');

  // Saved runs from before power-up choices existed have none offered - don't
  // block Continue on a selection that was never presented.
  const requiresSelection = powerUpChoices.length > 0;
  const canContinue = !requiresSelection || selectedIndex !== null;

  const handleNextEnemy = () => {
    setAdvancing(true);
    setError('');

    const advance = () => {
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

    if (requiresSelection) {
      const chosenId = powerUpChoices[selectedIndex];
      Meteor.call('game.choosePowerUp', chosenId, (err) => {
        if (err) {
          setAdvancing(false);
          console.error('game.choosePowerUp failed:', err);
          setError(err.reason || 'Could not save your power-up choice.');
          return;
        }
        advance();
      });
    } else {
      advance();
    }
  };

  return (
    <div className="h-screen bg-slate-900 flex flex-col items-center justify-center gap-4 overflow-hidden px-8 py-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-emerald-400">
          Stage {stage} Cleared!
        </h1>
        <p className="text-slate-300 text-base mt-1">
          You defeated {enemyName}. {FINAL_STAGE - stage} to go.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 w-full max-w-3xl">
        <div className="w-full max-w-xs">
          <BossRecapTable bossRecap={bossRecap} title="Run so far" compact />
        </div>
        {requiresSelection && (
          <PowerUpChoices
            powerUpChoices={powerUpChoices}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
        )}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex flex-col items-center gap-2">
        <button
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-lg transition-colors disabled:opacity-50"
          onClick={handleNextEnemy}
          disabled={advancing || !canContinue}
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
    </div>
  );
}


