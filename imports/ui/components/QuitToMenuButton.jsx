import React from 'react';

/**
 * Leaves an in-progress run for the main menu.
 *
 * No server call is needed: every game.* method already persists the full run
 * state, so the save is always current. Unmounting the battle screen also stops
 * its heartbeat, which is what lets GameEngine.rebaseAfterAway() recognise the
 * time away and hold the timer debuff and recap clock steady until Continue.
 */
export function QuitToMenuButton({ onQuit }) {
  const handleQuit = () => {
    document.getElementById('settings-modal')?.close();
    onQuit();
  };

  return (
    <button
      tyle={{ fontFamily: 'var(--game-font)'}} className="px-6 py-2.5 bg-red-800 hover:bg-red-700 text-white text-2xl rounded-lg text-lg transition-colors"
      onClick={handleQuit}
    >
      Quit to Menu
    </button>
  );
}
