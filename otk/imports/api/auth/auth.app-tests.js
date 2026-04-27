import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { assert } from 'chai';

/**
 * Full-app integration tests for authentication login behaviour
 * and current user data retrieval.
 *
 * These tests validate:
 * - Successful login with correct credentials
 * - Failed login with incorrect username
 * - Failed login with incorrect password
 * - Retrieval of the correct logged-in user data through the
 *   `auth.currentUser` publication
 *
 * Test Scope:
 * - Client-side app tests
 * - Uses Meteor's built-in `loginWithPassword` authentication flow
 * - Uses test helper methods to create and clear test users
 */
describe('auth login and current user retrieval', function () {
  /**
   * Known test credentials used for login and retrieval tests.
   */
  const username = 'loginuser';
  const email = 'loginuser@example.com';
  const password = 'secure123';

  if (Meteor.isClient) {
    /**
     * Creates a clean test user before each test.
     *
     * The database is cleared first to prevent test state from leaking
     * between test cases. A known user is then created so login tests
     * have predictable credentials.
     */
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

    /**
     * Logs the client out after each test.
     *
     * This ensures that one test's authenticated session does not affect
     * the next test case.
     */
    afterEach(function (done) {
      Meteor.logout(() => done());
    });

    /**
     * Test: Valid credentials should allow the user to log in.
     *
     * Verifies that:
     * - No login error is returned
     * - Meteor assigns a userId after successful login
     */
    it('logs in with the correct username and password', function (done) {
      Meteor.loginWithPassword(username, password, function (error) {
        assert.isUndefined(error);
        assert.isTrue(!!Meteor.userId());
        done();
      });
    });

    /**
     * Test: Incorrect username should fail login.
     *
     * Verifies that:
     * - Login returns an error
     * - No user session is created
     */
    it('fails login with an incorrect username', function (done) {
      Meteor.loginWithPassword('wronguser', password, function (error) {
        assert.exists(error);
        assert.isFalse(!!Meteor.userId());
        done();
      });
    });

    /**
     * Test: Incorrect password should fail login.
     *
     * Verifies that:
     * - Login returns an error
     * - No user session is created
     */
    it('fails login with an incorrect password', function (done) {
      Meteor.loginWithPassword(username, 'wrongpass', function (error) {
        assert.exists(error);
        assert.isFalse(!!Meteor.userId());
        done();
      });
    });

    /**
     * Test: Logged-in user should retrieve their own user data.
     *
     * Verifies that:
     * - User can log in successfully
     * - The `auth.currentUser` subscription becomes ready
     * - `Meteor.user()` returns the expected user document
     * - The retrieved username, email, and profile data match the
     *   test user's stored values
     */
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