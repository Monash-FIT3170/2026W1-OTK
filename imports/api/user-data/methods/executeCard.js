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
        'Must be logged in.'
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

    const newState = engine.toJSON();
    if (engine.isEnemyDefeated()) {
      newState.result = 'win';
    }

    await UserDataCollection.updateAsync(
      { userId: this.userId },
      { $set: { gameState: newState } }
    );
  },
});
