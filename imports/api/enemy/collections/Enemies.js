import { Mongo } from 'meteor/mongo';

export const EnemiesCollection =
  global.EnemiesCollection ||
  (global.EnemiesCollection = new Mongo.Collection('enemies'));
