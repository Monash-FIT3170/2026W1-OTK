import { Meteor } from 'meteor/meteor';
import { UserDataCollection } from '../collections/UserDataCollection';
import { GameEngine } from '../../../engine/GameEngine';

Meteor.methods({
  'game.applyTimerTick': async function () {
    if (!this.userId) throw new Meteor.Error('notLoggedIn');
    const userData = await UserDataCollection.findOneAsync({ userId: this.userId });
    if (!userData) throw new Meteor.Error('noUserData');
    const engine = new GameEngine(userData.gameState);
    engine.resolveTimerDebuff();
    const newState = engine.toJSON();
    await UserDataCollection.updateAsync({ userId: this.userId }, { $set: { gameState: newState } });
  },
});