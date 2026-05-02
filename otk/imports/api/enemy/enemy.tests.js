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
