import { Meteor } from 'meteor/meteor';
import { UserDataCollection } from '../collections/UserDataCollection';
import { GameEngine } from '../../../engine/GameEngine';

Meteor.methods({
  'game.applyPowerup': async function ({ powerupId }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'game.applyPowerup.notLoggedIn',
        'Must be logged in to use a powerup.'
      );
    }

    const userData = await UserDataCollection.findOneAsync({ userId: this.userId });
    if (!userData?.gameState) {
      throw new Meteor.Error('game.applyPowerup.noUserData', 'No user data found.');
    }

    if (userData.gameState.result !== 'playing') {
      throw new Meteor.Error(
        'game.applyPowerup.notActive',
        'Powerups can only be used during an active battle.'
      );
    }

    const engine = new GameEngine(userData.gameState);
    engine.applyPowerup(powerupId);

    const nextGameState = engine.toJSON();
    await UserDataCollection.updateAsync(
      { userId: this.userId },
      { $set: { gameState: nextGameState } }
    );

    return nextGameState;
  },
});
