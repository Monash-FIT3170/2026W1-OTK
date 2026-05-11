import { Meteor } from 'meteor/meteor';
import { UserDataCollection } from '../collections/UserDataCollection';

Meteor.methods({
  /**
   * Player forfeits their turn. Because the game is OTK (one turn to kill),
   * ending your turn without defeating the enemy is an immediate loss.
   */
  'game.endTurn': async function () {
    if (!this.userId) {
      throw new Meteor.Error('game.endTurn.notLoggedIn', 'Must be logged in to end turn.');
    }

    await UserDataCollection.updateAsync(
      { userId: this.userId },
      { $set: { 'gameState.result': 'loss' } }
    );
  },
});
