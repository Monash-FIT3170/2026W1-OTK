import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import Settings from './components/Settings';

export const LandingPage = ({
  hasSave,
  onStart,
  onOpenTutorial,
  onOpenTrainingMode,
  onOpenLeaderboard,
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
        <h1 style={{ fontFamily: 'var(--game-font)'}} className="text-7xl font-semibold text-white tracking-wide drop-shadow-lg">
          One Turn Kill
        </h1>

        {!confirmingNewGame && (
          <div className="flex flex-col gap-4 w-64">
            {hasSave && (
              <button
                onClick={handleContinue}
                style={{ fontFamily: 'var(--game-font)'}} className="border-2 border-slate-600 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-2xl transition-colors"
              >
                Continue
              </button>
            )}

            <button
              onClick={handleNewGame}
              disabled={starting}
              style={{ fontFamily: 'var(--game-font)'}} className="border-2 border-slate-600 px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-2xl transition-colors disabled:opacity-50"
            >
              New Game
            </button>

            <div className="flex flex-col gap-1">
              <button
                onClick={handleEditDeck}
                style={{ fontFamily: 'var(--game-font)'}} className="border-2 border-slate-600 px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-2xl transition-colors"
              >
                Edit Deck
              </button>
              {hasSave && (
                // The deck is locked for the duration of a run: edits are saved
                // to nextDeck and only picked up by game.newGame.
                <p style={{ fontFamily: 'var(--game-font)'}} className="text-slate-400 text-xl text-center">
                  Applies to your next run
                </p>
              )}
            </div>

            <button
              onClick={handleOptions}
              style={{ fontFamily: 'var(--game-font)'}} className="border-2 border-slate-600 px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-2xl transition-colors"
            >
              Options
            </button>

            <button
              onClick={onOpenTutorial}
              style={{ fontFamily: 'var(--game-font)'}} className="border-2 border-slate-600 px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-2xl transition-colors"
            >
              Tutorial
            </button>

            <button
              onClick={onOpenTrainingMode}
              style={{ fontFamily: 'var(--game-font)'}} className="border-2 border-slate-600 px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-2xl transition-colors"
            >
              Training Mode
            </button>

            <button
              onClick={onOpenLeaderboard}
              style={{ fontFamily: 'var(--game-font)'}} className="border-2 border-slate-600 px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-2xl transition-colors"
            >
              Leaderboard
            </button>

            <button
              onClick={handleQuit}
              style={{ fontFamily: 'var(--game-font)'}} className="px-6 py-3 rounded-lg bg-red-700 hover:bg-red-600 text-white text-2xl transition-colors"
            >
              Quit
            </button>
          </div>
        )}

        {confirmingNewGame && (
          <div className="flex flex-col items-center gap-4 w-72">
            <p style={{ fontFamily: 'var(--game-font)'}} className="text-white text-xl text-center">
              Starting a new game will overwrite your current save. Are you
              sure?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleNewGame}
                disabled={starting}
                style={{ fontFamily: 'var(--game-font)'}} className="px-5 py-2 text-2xl rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors disabled:opacity-50"
              >
                {starting ? 'Starting...' : 'Overwrite'}
              </button>
              <button
                onClick={() => setConfirmingNewGame(false)}
                style={{ fontFamily: 'var(--game-font)'}} className="px-5 py-2 text-2xl rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
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