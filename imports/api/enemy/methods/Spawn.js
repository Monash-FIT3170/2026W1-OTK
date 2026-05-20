import { Meteor } from 'meteor/meteor';
import { EnemiesCollection } from '../collections/Enemies.js';
import { enemyRegistry } from '../../../engine/enemy/EnemyRegistry';

Meteor.methods({
  async 'enemy.spawn'(enemyId) {
    const EnemyClass = enemyRegistry.get(enemyId);
    if (!EnemyClass) {
      throw new Meteor.Error('enemy.spawn.not-found', `Unknown enemyId: ${enemyId}`);
    }
    const enemy = new EnemyClass();
    return await EnemiesCollection.insertAsync(enemy.toJSON());
  },
});
