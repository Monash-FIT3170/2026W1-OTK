import { Meteor } from 'meteor/meteor';
import { UserDataCollection } from '../collections/UserDataCollection';
import { check } from 'meteor/check';
import { GameEngine } from '../../../engine/GameEngine';

Meteor.methods({
  // TODO: load game state, draw cards equal to card cost, save with pendingPlay: { cardId },
  // return { requiresSelection, cardAmountToSelect } to client
  'game.drawCards': async function ({ cardId }) {
    // TODO: implement draw logic
  },
});
