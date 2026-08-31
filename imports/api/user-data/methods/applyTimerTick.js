import { Meteor } from 'meteor/meteor';
import { UserDataCollection } from '../collections/UserDataCollection';
import { GameEngine } from '../../../engine/GameEngine';

Meteor.methods({
  /**
   * Heartbeat from a mounted battle screen.
   *
   * Two jobs: resolve the timer debuff so the enemy heals in real time rather
   * than only on the player's next card, and keep lastActiveAt fresh so that a
   * player sitting at the battle screen counts as present. A gap in these
   * heartbeats is what GameEngine.rebaseAfterAway() reads as "tab was closed".
   */
  'game.applyTimerTick': async function () {
    if (!this.userId) throw new Meteor.Error('notLoggedIn');

    const userData = await UserDataCollection.findOneAsync({
      userId: this.userId,
    });
    if (!userData) throw new Meteor.Error('noUserData');

    // Only a live fight has clocks to advance.
    if (userData.gameState?.result !== 'playing') return;

    const engine = new GameEngine(userData.gameState);
    engine.rebaseAfterAway();
    engine.resolveTimerDebuff();
    engine.touch();

    await UserDataCollection.updateAsync(
      { userId: this.userId },
      { $set: { gameState: engine.toJSON() } }
    );
  },
});
