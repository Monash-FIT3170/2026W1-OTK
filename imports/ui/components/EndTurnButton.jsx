import { Meteor } from 'meteor/meteor';

export function EndTurnButton({ disabled = false }) {
  return (
    <button
    style={{ fontFamily: 'var(--game-font)'}}
      className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white rounded-lg text-3xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      onClick={() => Meteor.call('game.endTurn')}
      disabled={disabled}
      title={
        disabled
          ? 'Finish the tutorial before ending your turn'
          : undefined
      }
    >
      End Turn
    </button>
  );
}