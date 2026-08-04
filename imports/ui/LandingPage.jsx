import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { GameBackground } from './components/GameBackground';

export const LandingPage = ({ hasSave, onStart }) => {
  const [confirmingNewGame, setConfirmingNewGame] = useState(false);
  const [starting, setStarting] = useState(false);

  const handleContinue = () => {
    onStart();
  };

  const handleNewGame = () => {
    //
  };

  const handleEditDeck = () => {
    // Deck-building page is a future sprint's task - this is just the entry point for now.
  };

  return (
    <GameBackground backgroundScene="landing">
      <div className="min-h-screen flex flex-col items-center justify-center gap-8">
        <h1 className="text-5xl font-bold text-white tracking-wide drop-shadow-lg">
          One Turn Kill
        </h1>

        {!confirmingNewGame && (
          <div className="flex flex-col gap-4 w-64">
            {hasSave && (
              <button
                onClick={handleContinue}
                className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-semibold transition-colors"
              >
                Continue
              </button>
            )}

            <button
              onClick={handleNewGame}
              disabled={starting}
              className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-lg font-semibold transition-colors disabled:opacity-50"
            >
              {hasSave ? 'New Game' : 'Start'}
            </button>

            <button
              onClick={handleEditDeck}
              className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-lg font-semibold transition-colors"
            >
              Edit Deck
            </button>
          </div>
        )}

        {confirmingNewGame && (
          <div className="flex flex-col items-center gap-4 w-72">
            <p className="text-white text-center">
              Starting a new game will overwrite your current save. Are you sure?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleNewGame}
                disabled={starting}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors disabled:opacity-50"
              >
                {starting ? 'Starting...' : 'Overwrite'}
              </button>
              <button
                onClick={() => setConfirmingNewGame(false)}
                className="px-5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </GameBackground>
  );
};

export default LandingPage;