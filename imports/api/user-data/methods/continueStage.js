import { Meteor } from 'meteor/meteor';
import { UserDataCollection } from '../collections/UserDataCollection';
import { GameEngine } from '../../../engine/GameEngine';

Meteor.methods({
  /**
   * Advances to the next boss after a stage victory (result === 'stageWin').
   */
  'game.continueStage': async function () {
    if (!this.userId) {
      throw new Meteor.Error(
        'game.continueStage.notLoggedIn',
        'Must be logged in.'
      );
    }

    const userData = await UserDataCollection.findOneAsync({
      userId: this.userId,
    });
    if (!userData) {
      throw new Meteor.Error(
        'game.continueStage.noUserData',
        'No user data found.'
      );
    }
    if (userData.gameState.result !== 'stageWin') {
      throw new Meteor.Error(
        'game.continueStage.invalidState',
        'Not currently between stages.'
      );
    }

    const engine = new GameEngine(userData.gameState);
    engine.advanceStage();

    await UserDataCollection.updateAsync(
      { userId: this.userId },
      { $set: { gameState: engine.toJSON() } }
    );
  },
});
