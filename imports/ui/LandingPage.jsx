import React, { useRef, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import Settings from './components/Settings';

export const LandingPage = ({
  hasSave,
  onStart,
  isNewGameSetup = false,
  difficulty = 'easy',
  onDifficultyChange = () => {},
  onOpenNewGameSetup = () => {},
  onBackToMenu = () => {},
  onOpenTutorial,
  onOpenTrainingMode,
  onEditDeck,
}) => {
  const [confirmingNewGame, setConfirmingNewGame] = useState(false);
  const [starting, setStarting] = useState(false);
  const [difficultyOpen, setDifficultyOpen] = useState(false);
  const difficultyTriggerRef = useRef(null);
  const difficultyLabel = difficulty[0].toUpperCase() + difficulty.slice(1);

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
    Meteor.call('game.newGame', difficulty, (err) => {
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

        {!isNewGameSetup && (
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
              onClick={onOpenNewGameSetup}
              className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-lg font-semibold transition-colors disabled:opacity-50"
            >
              New Game
            </button>

            <button
              onClick={onOpenTutorial}
              className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-lg font-semibold transition-colors"
            >
              Tutorial
            </button>

            <button
              onClick={onOpenTrainingMode}
              className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-lg font-semibold transition-colors"
            >
              Training Mode
            </button>

            <div className="flex flex-col gap-1">
              <button
                onClick={handleEditDeck}
                className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-lg font-semibold transition-colors"
              >
                Edit Deck
              </button>
              {hasSave}
            </div>

            <button
              onClick={handleOptions}
              className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-lg font-semibold transition-colors"
            >
              Options
            </button>

            <button
              onClick={handleQuit}
              className="px-6 py-3 rounded-lg bg-red-700 hover:bg-red-600 text-white text-lg font-semibold transition-colors"
            >
              Quit
            </button>
          </div>
        )}

        {isNewGameSetup && !confirmingNewGame && (
          <div className="flex flex-col gap-4 w-72">
            <h2 className="text-2xl font-semibold text-white text-center">
              New Game Setup
            </h2>
            <div className="flex items-center justify-between gap-3 text-white">
              <span className="font-semibold">Difficulty</span>
              <div
                className="relative w-36"
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setDifficultyOpen(false);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    setDifficultyOpen(false);
                    difficultyTriggerRef.current?.focus();
                  }
                }}
              >
                <button
                  ref={difficultyTriggerRef}
                  type="button"
                  aria-label={`Difficulty: ${difficultyLabel}`}
                  aria-haspopup="true"
                  aria-expanded={difficultyOpen}
                  aria-controls="difficulty-options"
                  onClick={() => setDifficultyOpen((open) => !open)}
                  disabled={starting}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-50"
                >
                  <span>{difficultyLabel}</span>
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 rotate-45 border-b-2 border-r-2 border-slate-300 transition-transform ${difficultyOpen ? 'translate-y-1 -rotate-[135deg]' : '-translate-y-0.5'}`}
                  />
                </button>
                {difficultyOpen && (
                  <div
                    id="difficulty-options"
                    role="group"
                    aria-label="Difficulty options"
                    className="absolute right-0 top-full z-20 mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-1 shadow-xl shadow-black/30"
                  >
                    {[
                      { value: 'easy', label: 'Easy' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'hard', label: 'Hard' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={difficulty === option.value}
                        onClick={() => {
                          onDifficultyChange(option.value);
                          setDifficultyOpen(false);
                          difficultyTriggerRef.current?.focus();
                        }}
                        className={`w-full rounded-md px-3 py-2 text-left text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${difficulty === option.value ? 'bg-emerald-700 text-white' : 'text-slate-200 hover:bg-slate-700 hover:text-white'}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleNewGame}
              disabled={starting}
              className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-semibold transition-colors disabled:opacity-50"
            >
              Start New Game
            </button>
            <button
              onClick={onBackToMenu}
              disabled={starting}
              className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors disabled:opacity-50"
            >
              Back
            </button>
          </div>
        )}

        {isNewGameSetup && confirmingNewGame && (
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
                disabled={starting}
                className="px-5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors disabled:opacity-50"
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