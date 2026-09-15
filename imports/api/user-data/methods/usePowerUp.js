import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { UserDataCollection } from '../collections/UserDataCollection';
import { GameEngine } from '../../../engine/GameEngine';

Meteor.methods({
  /**
   * Consumes a power-up from the inventory to trigger its effect mid-battle.
   * Dispatches through the power-up registry, so this covers every
   * registered power-up (currently just the damage-dealing DealDamagePowerUp).
   */
  'game.usePowerUp': async function (index) {
    check(index, Number);

    if (!this.userId) {
      throw new Meteor.Error(
        'game.usePowerUp.notLoggedIn',
        'Must be logged in to use a power-up.'
      );
    }

    const userData = await UserDataCollection.findOneAsync({
      userId: this.userId,
    });
    if (!userData) {
      throw new Meteor.Error(
        'game.usePowerUp.noUserData',
        'No user data found.'
      );
    }

    const engine = new GameEngine(userData.gameState);
    engine.rebaseAfterAway();
    engine.usePowerUp(index);

    if (engine.isEnemyDefeated()) {
      // Records the recap entry and moves the run to 'stageCleared' or 'win'.
      engine.clearStage();
    }

    engine.touch();

    await UserDataCollection.updateAsync(
      { userId: this.userId },
      { $set: { gameState: engine.toJSON() } }
    );
  },
});
