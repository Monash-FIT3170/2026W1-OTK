import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Notes } from './notes.js';
import './methods.js';

if (Meteor.isServer) {
  describe('Notes methods', function () {
    beforeEach(function () {
      Notes.remove({});
    });

    it('inserts a note', function () {
      Meteor.server.method_handlers['notes.insert'].apply(
        { userId: 'testUserId' },
        [{ title: 'Groceries', body: 'Milk, Eggs' }]
      );
      expect(Notes.find().count()).to.equal(1);
    });

    it('throws if not authenticated', function () {
      expect(() => {
        Meteor.server.method_handlers['notes.insert'].apply(
          {},
          [{ title: 'Groceries', body: 'Milk, Eggs' }]
        );
      }).to.throw();
    });
  });
}