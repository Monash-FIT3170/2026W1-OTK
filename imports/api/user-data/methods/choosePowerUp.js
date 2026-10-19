import { Meteor } from 'meteor/meteor';
import { UserDataCollection } from '../collections/UserDataCollection';
import { GameEngine } from '../../../engine/GameEngine';

Meteor.methods({
  /**
   * Adds the player's chosen stage-clear reward to the run's power-up
   * inventory.
   */
  'game.choosePowerUp': async function (powerUpId) {
    if (!this.userId) {
      throw new Meteor.Error(
        'game.choosePowerUp.notLoggedIn',
        'Must be logged in to choose a power-up.'
      );
    }

    const userData = await UserDataCollection.findOneAsync({
      userId: this.userId,
    });
    if (!userData) {
      throw new Meteor.Error(
        'game.choosePowerUp.noUserData',
        'No user data found.'
      );
    }

    if (userData.gameState?.result !== 'stageCleared') {
      throw new Meteor.Error(
        'game.choosePowerUp.notBetweenStages',
        'Power-ups can only be chosen between stages.'
      );
    }

    const engine = new GameEngine(userData.gameState);
    engine.choosePowerUp(powerUpId);
    engine.touch();

    await UserDataCollection.updateAsync(
      { userId: this.userId },
      { $set: { gameState: engine.toJSON() } }
    );
  },
});
