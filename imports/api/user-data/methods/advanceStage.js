import { Meteor } from 'meteor/meteor';
import { UserDataCollection } from '../collections/UserDataCollection';
import { GameEngine } from '../../../engine/GameEngine';

Meteor.methods({
  /**
   * Moves a run from the stage-clear interstitial into the next boss fight.
   *
   * The next stage's deck is rebuilt from the run's locked baseDeck, never from
   * the player's saved nextDeck - a deck edited mid-run only takes effect on the
   * next game.newGame.
   */
  'game.advanceStage': async function () {
    if (!this.userId) {
      throw new Meteor.Error(
        'game.advanceStage.notLoggedIn',
        'Must be logged in to advance stage.'
      );
    }

    const userData = await UserDataCollection.findOneAsync({
      userId: this.userId,
    });
    if (!userData) {
      throw new Meteor.Error(
        'game.advanceStage.noUserData',
        'No user data found.'
      );
    }

    if (userData.gameState?.result !== 'stageCleared') {
      throw new Meteor.Error(
        'game.advanceStage.notBetweenStages',
        'The current stage has not been cleared.'
      );
    }

    const engine = new GameEngine(userData.gameState);
    engine.advanceStage();
    engine.touch();

    await UserDataCollection.updateAsync(
      { userId: this.userId },
      { $set: { gameState: engine.toJSON() } }
    );
  },
});
