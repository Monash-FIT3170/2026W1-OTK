import { Meteor } from 'meteor/meteor';
import { EnemiesCollection } from '../collections/Enemies.js';
import { enemyRegistry } from '../../../engine/enemy/index.js';

Meteor.methods({
  async 'enemy.spawn'(enemyId) {
    const EnemyClass = enemyRegistry.get(enemyId);
    const instance = new EnemyClass();
    return await EnemiesCollection.insertAsync(instance.toJSON());
  },
});