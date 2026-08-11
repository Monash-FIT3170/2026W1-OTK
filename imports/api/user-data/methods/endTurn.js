import { Meteor } from 'meteor/meteor';
import { UserDataCollection } from '../collections/UserDataCollection';
import { GameEngine } from '../../../engine/GameEngine';

Meteor.methods({
  /**
   * Player forfeits their turn. Because the game is OTK (one turn to kill),
   * ending your turn without defeating the enemy is an immediate loss.
   */
  'game.endTurn': async function () {
    if (!this.userId) {
      throw new Meteor.Error('game.endTurn.notLoggedIn', 'Must be logged in to end turn.');
    }

    const userData = await UserDataCollection.findOneAsync({ userId: this.userId });
    if (!userData) {
      throw new Meteor.Error('game.endTurn.noUserData', 'No user data found.');
    }

    const engine = new GameEngine(userData.gameState);
    engine.finalizeBossRecap('loss');
    engine.result = 'loss';

    await UserDataCollection.updateAsync(
      { userId: this.userId },
      { $set: { gameState: engine.toJSON() } }
    );
  },
});
