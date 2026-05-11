import { Meteor } from 'meteor/meteor';
import { UserDataCollection } from '../collections/UserDataCollection';
import { check, Match } from 'meteor/check';
import { GameEngine } from '../../../engine/GameEngine';

Meteor.methods({
  'game.executeCard': async function ({ uniqueCardId, selectedCardIds }) {
    check(uniqueCardId, String);
    check(selectedCardIds, Match.Optional([String]));

    if (!this.userId) {
      throw new Meteor.Error(
        'game.executeCard.notLoggedIn',
        'Must be logged in to execute a card.'
      );
    }

    const userData = await UserDataCollection.findOneAsync({
      userId: this.userId,
    });
    if (!userData) {
      throw new Meteor.Error(
        'game.executeCard.noUserData',
        'No user data found.'
      );
    }

    const engine = new GameEngine(userData.gameState);
    engine.executeCard(uniqueCardId, selectedCardIds ?? []);

    // Build the updated state and attach win/loss result
    const newState = engine.toJSON();
    if (engine.isEnemyDefeated()) {
      newState.result = 'win';
    } else if (!engine.hasPlayableCards()) {
      // Hand and deck both exhausted — player cannot continue
      newState.result = 'loss';
    }

    await UserDataCollection.updateAsync(
      { userId: this.userId },
      { $set: { gameState: newState } }
    );
  },
});
