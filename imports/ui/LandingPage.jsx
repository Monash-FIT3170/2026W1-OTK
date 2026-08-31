import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import Settings from './components/Settings';

export const LandingPage = ({
  hasSave,
  onStart,
  onOpenTutorial,
  onEditDeck,
}) => {
  const [confirmingNewGame, setConfirmingNewGame] = useState(false);
  const [starting, setStarting] = useState(false);

  const handleContinue = () => {
    // gameState is already loaded reactively in App.jsx from the user's save —
    // nothing to fetch here, just leave the landing page. isNewGame is
    // explicitly false so this never triggers the auto-tutorial.
    onStart(false);
  };

  const handleNewGame = () => {
    if (hasSave && !confirmingNewGame) {
      //ask for confirmation
      setConfirmingNewGame(true);
      return;
    }

    setStarting(true);
    Meteor.call('game.newGame', (err) => {
      setStarting(false);
      if (err) {
        console.error('game.newGame failed:', err);
        return;
      }
      setConfirmingNewGame(false);
      // isNewGame=true is what lets App.jsx auto-show the tutorial for
      // first-time players. Continue deliberately never passes true.
      onStart(true);
    });
  };

  const handleEditDeck = () => {
    // Deck-building page
    onEditDeck();
  };

  const handleOptions = () => {
    // Reuses the settings dialog rendered by <Settings showTrigger={false} /> below.
    document.getElementById('settings-modal')?.showModal();
  };

  const handleQuit = () => {
    Meteor.logout();
  };

  return (
    <div className="min-h-screen w-screen bg-slate-900">
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
              New Game
            </button>

            <div className="flex flex-col gap-1">
              <button
                onClick={handleEditDeck}
                className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-lg font-semibold transition-colors"
              >
                Edit Deck
              </button>
              {hasSave && (
                // The deck is locked for the duration of a run: edits are saved
                // to nextDeck and only picked up by game.newGame.
                <p className="text-slate-400 text-sm text-center">
                  Applies to your next run
                </p>
              )}
            </div>

            <button
              onClick={handleOptions}
              className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-lg font-semibold transition-colors"
            >
              Options
            </button>

            <button
              onClick={onOpenTutorial}
              className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-lg font-semibold transition-colors"
            >
              Tutorial
            </button>

            <button
              onClick={handleQuit}
              className="px-6 py-3 rounded-lg bg-red-700 hover:bg-red-600 text-white text-lg font-semibold transition-colors"
            >
              Quit
            </button>
          </div>
        )}

        {confirmingNewGame && (
          <div className="flex flex-col items-center gap-4 w-72">
            <p className="text-white text-center">
              Starting a new game will overwrite your current save. Are you
              sure?
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

      {/* Hosts the settings dialog without its own gear-icon trigger,
          since Options above opens it directly. */}
      <Settings showTrigger={false} />
    </div>
  );
};

export default LandingPage;
