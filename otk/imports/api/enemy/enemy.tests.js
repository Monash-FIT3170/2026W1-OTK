import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { EnemiesCollection } from './collections/Enemies.js';

if (Meteor.isServer) {
  describe('Enemies', function () {
    beforeEach(async function () {
      await EnemiesCollection.removeAsync({});
    });

    describe('enemy.spawn method', function () {
      it('inserts the enemy into the collection with correct fields', async function () {
        await Meteor.callAsync('enemy.spawn', 'goblin');

        const goblin = await EnemiesCollection.findOneAsync({ enemyId: 'goblin' });
        assert.isOk(goblin, 'goblin document should exist');
        assert.equal(goblin.name, 'Goblin');
        assert.equal(goblin.health, 20);
        assert.equal(goblin.currentHealth, 20);
        assert.isArray(goblin.debuffs);
      });
    });

    describe('enemy.damage method', function () {
      it('decrements the enemy current health by the damage value', async function () {
        const enemyDocumentId = await Meteor.callAsync('enemy.spawn', 'goblin');

        const currentHealth = await Meteor.callAsync(
          'enemy.damage',
          enemyDocumentId,
          7
        );

        const enemy = await EnemiesCollection.findOneAsync(enemyDocumentId);
        assert.equal(currentHealth, 13);
        assert.equal(enemy.currentHealth, 13);
      });

      it('adds multiple card damage values before applying damage', async function () {
        const enemyDocumentId = await Meteor.callAsync('enemy.spawn', 'goblin');

        const currentHealth = await Meteor.callAsync(
          'enemy.damage',
          enemyDocumentId,
          [3, 4, 5]
        );

        const enemy = await EnemiesCollection.findOneAsync(enemyDocumentId);
        assert.equal(currentHealth, 8);
        assert.equal(enemy.currentHealth, 8);
      });

      it('does not reduce enemy current health below zero', async function () {
        const enemyDocumentId = await Meteor.callAsync('enemy.spawn', 'goblin');

        const currentHealth = await Meteor.callAsync(
          'enemy.damage',
          enemyDocumentId,
          99
        );

        const enemy = await EnemiesCollection.findOneAsync(enemyDocumentId);
        assert.equal(currentHealth, 0);
        assert.equal(enemy.currentHealth, 0);
      });
    });

    describe('enemies.all publication', function () {
      it('publishes all documents in the enemies collection', async function () {
        await EnemiesCollection.insertAsync({
          enemyId: 'goblin',
          name: 'Goblin',
          health: 20,
          currentHealth: 20,
          debuffs: [],
        });

        const handler = Meteor.server.publish_handlers['enemies.all'];
        const cursor = handler.call({});
        const docs = await cursor.fetchAsync();

        assert.equal(docs.length, 1);
        assert.equal(docs[0].enemyId, 'goblin');
      });
    });
  });
}
