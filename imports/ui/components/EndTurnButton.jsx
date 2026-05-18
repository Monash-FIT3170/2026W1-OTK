import { Meteor } from 'meteor/meteor';

export function EndTurnButton() {
  return (
    <button
      className="px-4 py-1.5 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg text-sm transition-colors"
      onClick={() => Meteor.call('game.endTurn')}
    >
      End Turn
    </button>
  );
}
