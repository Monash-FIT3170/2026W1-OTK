import { Meteor } from 'meteor/meteor';
import { EnemiesCollection } from './collections/Enemies.js';

Meteor.publish('enemies.all', function () {
  return EnemiesCollection.find();
});