import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { assert } from 'chai';

describe('auth login and current user retrieval', function () {
  const username = 'loginuser';
  const email = 'loginuser@example.com';
  const password = 'secure123';

  if (Meteor.isClient) {
    beforeEach(function (done) {
      Meteor.call('auth.clearTestUsers', (clearError) => {
        assert.isUndefined(clearError);

        Meteor.call(
          'auth.createTestUser',
          {
            username,
            email,
            password,
            profile: {
              favouriteCard: 'Slash',
            },
          },
          (createError) => {
            assert.isUndefined(createError);
            done();
          }
        );
      });
    });

    afterEach(function (done) {
      Meteor.logout(() => done());
    });

    it('logs in with the correct username and password', function (done) {
      Meteor.loginWithPassword(username, password, function (error) {
        assert.isUndefined(error);
        assert.isTrue(!!Meteor.userId());
        done();
      });
    });

    it('fails login with an incorrect username', function (done) {
      Meteor.loginWithPassword('wronguser', password, function (error) {
        assert.exists(error);
        assert.isFalse(!!Meteor.userId());
        done();
      });
    });

    it('fails login with an incorrect password', function (done) {
      Meteor.loginWithPassword(username, 'wrongpass', function (error) {
        assert.exists(error);
        assert.isFalse(!!Meteor.userId());
        done();
      });
    });

    it('retrieves the correct user data after login', function (done) {
      Meteor.loginWithPassword(username, password, function (loginError) {
        assert.isUndefined(loginError);

        const subHandle = Meteor.subscribe('auth.currentUser');

        const computation = Tracker.autorun(() => {
          if (!subHandle.ready()) {
            return;
          }

          const user = Meteor.user();

          if (!user) {
            return;
          }

          assert.equal(user.username, username);
          assert.equal(user.emails[0].address, email);
          assert.equal(user.profile.favouriteCard, 'Slash');

          computation.stop();
          subHandle.stop();
          done();
        });
      });
    });
  }
});