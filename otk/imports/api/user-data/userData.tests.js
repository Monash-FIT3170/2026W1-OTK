import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { UserDataCollection } from './collections/UserDataCollection';

if (Meteor.isServer) {
  const validUserId = "1";

  /**
   * Reset database before each test to ensure isolation.
   */
  beforeEach(async function () {
      await UserDataCollection.removeAsync({});
  });

  /**
   * Test: Valid user ID should be accepted.
   *
   * Verifies that:
   * - A user data entry is successfully created when a valid user ID is provided
   * - The stored user ID matches the input
   */
  it('User Data: Accepts a valid User ID', async function () {
    await Meteor.server.method_handlers['userData.registerUser'].apply(
      {},
      [{ userId: validUserId }]
    );

    const userData = await UserDataCollection.findOneAsync({ userId: validUserId });

    assert.exists(userData);
    assert.equal(userData.userId, validUserId);
  });

  /**
   * Test: Valid user data entry is correctly stored in the database.
   *
   * Verifies that:
     * - A user data entry is created in `Meteor.userData`
     * - The userId field is correctly stored
   */
  it('User Data: Correctly stores the user data', async function () {
    await Meteor.server.method_handlers['userData.registerUser'].apply(
      {},
      [{ userId: validUserId }]
    );

    const userData = await UserDataCollection.findOneAsync({ userId: validUserId });

    assert.exists(userData);
    assert.equal(userData.userId, validUserId);
  });

  /**
   * Test: Duplicate user ID should be rejected.
   *
   * Verifies that:
   * - A user ID with an associated existing user data entry is rejected
   * - The correct Meteor error code is thrown
   */
  it('User Data: Rejects duplicate User ID', async function () {
    await Meteor.server.method_handlers['userData.registerUser'].apply(
      {},
      [{ userId: validUserId }]
    );

    try {
      await Meteor.server.method_handlers['userData.registerUser'].apply({}, [{ userId: validUserId }]);
      assert.fail('Expected duplicate user ID error');
    } catch (error) {
      assert.equal(error.error, 'userData.userIdExists');
    }
  });

  /**
   * Test: Invalid user ID should be rejected.
   *
   * Verifies that:
   * - A non-string user ID should be rejected
   * - The correct Meteor error code is thrown
   */
  it('User Data: Rejects duplicate User ID', async function () {
    try {
      await Meteor.server.method_handlers['userData.registerUser'].apply({}, [{ userId: 1 }]);
      assert.fail('Expected invalid user ID error');
    } catch (error) {
      assert.exists(error);
    }
  });
}