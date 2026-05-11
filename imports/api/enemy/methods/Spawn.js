import { Meteor } from 'meteor/meteor';
import { EnemiesCollection } from '../collections/Enemies.js';
import { enemyRegistry } from '../../../engine/enemy/EnemyRegistry';

Meteor.methods({
  async 'enemy.spawn'(enemyId) {
    const enemyData = enemyRegistry.get(enemyId);
    if (!enemyData) {
      throw new Meteor.Error('enemy.spawn.not-found', `Unknown enemyId: ${enemyId}`);
    }
    return await EnemiesCollection.insertAsync({ ...enemyData });
  },
});
