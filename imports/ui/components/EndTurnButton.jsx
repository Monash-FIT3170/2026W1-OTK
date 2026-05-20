import { Meteor } from 'meteor/meteor';

export function EndTurnButton() {
  return (
    <button
      className="px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg text-xl transition-colors"
      onClick={() => Meteor.call('game.endTurn')}
    >
      End Turn
    </button>
  );
}
