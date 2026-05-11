import { Meteor } from 'meteor/meteor';
import { UserDataCollection } from '../collections/UserDataCollection';
import { check } from 'meteor/check';
import { GameEngine } from '../../../engine/GameEngine';

Meteor.methods({
  // TODO: load game state, call engine.drawCost(cardId), save updated state to UserDataCollection,
  // return { requiresSelection, cardAmountToSelect } to client
  'game.drawCards': async function ({ uniqueCardId }) {
    // TODO: implement draw logic
  },
});
