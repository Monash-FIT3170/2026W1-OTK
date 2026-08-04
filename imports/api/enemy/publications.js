
import { Meteor } from 'meteor/meteor';
import { EnemiesCollection } from './collections/Enemies.js';

// Meteor.publish only exists on the server. This module is reached from the
// client test bundle via tests/main.js, so the registration must be guarded.
if (Meteor.isServer) {
  Meteor.publish('enemies.all', function () {
    return EnemiesCollection.find();
  });
}