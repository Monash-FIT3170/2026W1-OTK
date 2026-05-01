import { Meteor } from 'meteor/meteor';
import { EnemiesCollection } from '../collections/Enemies.js';
import { applyEnemyDamage } from '../../../engine/enemy/enemy_damage.js';

Meteor.methods({

  // Finds enemy document from collection
  async 'enemy.damage'(enemyDocumentId, damageValues) {
    if (typeof enemyDocumentId !== 'string' || enemyDocumentId.length === 0) {
      throw new Meteor.Error(
        'enemy.damage.invalid-enemy-id',
        'Enemy document id must be provided.'
      );
    }

    const enemy = await EnemiesCollection.findOneAsync(enemyDocumentId);
    if (!enemy) {
      throw new Meteor.Error(
        'enemy.damage.not-found',
        'Could not find enemy to damage.'
      );
    }

    // Passes enemy object into enemy damage engine method
    let currentHealth;
    try {
      currentHealth = applyEnemyDamage(enemy, damageValues);  //Calls enemy damage engine helper method to apply damage
    } catch (error) {
      throw new Meteor.Error('enemy.damage.invalid-damage', error.message);
    }

    //Updates the enemy's current health and saves it back to the MongoDB collection.
    await EnemiesCollection.updateAsync(enemyDocumentId, {
      $set: { currentHealth },
    });

    return currentHealth;
  },
});
