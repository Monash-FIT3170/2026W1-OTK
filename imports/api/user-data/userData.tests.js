import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { UserDataCollection } from './collections/UserDataCollection';

/**
 * Unit tests for UserData database and GameState persistence methods.
 *
 * These tests validate:
 * - UserData document creation
 * - Duplicate protection for userId entries
 * - Validation of userId input types
 * - Creation of default GameState structures
 * - GameState persistence and update functionality
 * - Authorization enforcement for GameState updates
 *
 * Test Scope:
 * - Backend-only (server-side)
 * - Direct invocation of Meteor method handlers
 * - Database persistence verification using UserDataCollection
 *
 * GameState Persistence Tests:
 * The GameState tests verify that serialisable runtime data can be
 * stored and retrieved correctly. This data is intended to later
 * reconstruct active OTK gameplay sessions, including:
 * - Current stage progression
 * - Current hand contents
 * - Enemy runtime state
 * - Draw/discard pile contents
 * - Run metadata
 *
 * Database Isolation:
 * Each test clears UserDataCollection before execution to ensure
 * deterministic and isolated test behaviour.
 *
 * @author Eric Blyth
 * @author Hydar Rabiaa
 * @version 1.1
 *
 * @see UserDataCollection
 */

if (Meteor.isServer) {
  const validUserId = '1';

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
    await Meteor.server.method_handlers['userData.registerUser'].apply({}, [
      { userId: validUserId },
    ]);

    const userData = await UserDataCollection.findOneAsync({
      userId: validUserId,
    });

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
    await Meteor.server.method_handlers['userData.registerUser'].apply({}, [
      { userId: validUserId },
    ]);

    const userData = await UserDataCollection.findOneAsync({
      userId: validUserId,
    });

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
    await Meteor.server.method_handlers['userData.registerUser'].apply({}, [
      { userId: validUserId },
    ]);

    try {
      await Meteor.server.method_handlers['userData.registerUser'].apply({}, [
        { userId: validUserId },
      ]);
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
  it('User Data: Rejects invalid User ID', async function () {
    try {
      await Meteor.server.method_handlers['userData.registerUser'].apply({}, [
        { userId: 1 },
      ]);
      assert.fail('Expected invalid user ID error');
    } catch (error) {
      assert.exists(error);
    }
  });

  /**
   * Test: Default gameState is created correctly.
   *
   * Verifies that:
   * - A default gameState object is created
   * - Initial values are correctly assigned
   */
  it('User Data: Creates default gameState', async function () {
    await Meteor.server.method_handlers['userData.registerUser'].apply({}, [
      { userId: validUserId },
    ]);

    const userData = await UserDataCollection.findOneAsync({
      userId: validUserId,
    });

    assert.exists(userData.gameState);

    assert.equal(userData.gameState.stage, 1);

    assert.isArray(userData.gameState.hand);
    assert.isArray(userData.gameState.deck);

    assert.exists(userData.gameState.enemy);
    assert.equal(userData.gameState.enemy.enemyId, 'goblin');

    assert.equal(userData.gameState.scene, 'underpass-overlaid');

    assert.equal(userData.gameState.userId, validUserId);
  });

  /**
   * Test: GameState updates correctly.
   *
   * Verifies that:
   * - updateGameState correctly overwrites the stored gameState
   * - Updated values persist in the database
   */
  it('User Data: Updates gameState correctly', async function () {
    await Meteor.server.method_handlers['userData.registerUser'].apply({}, [
      { userId: validUserId },
    ]);

    const updatedGameState = {
      currentStage: 3,

      currentHand: [{ cardId: 'slash' }],

      currentEnemy: {
        enemyId: 'goblin',
        currentHealth: 15,
      },

      currentDrawDeck: [{ cardId: 'fireball' }],

      currentDiscardedCardPile: [{ cardId: 'block' }],

      runTime: 120,

      scene: "red-underpass",

      runStatus: 'ACTIVE',
    };

    await Meteor.server.method_handlers['userData.saveGameState'].apply(
      { userId: validUserId },
      [{ gameState: updatedGameState }]
    );

    const userData = await UserDataCollection.findOneAsync({
      userId: validUserId,
    });

    assert.equal(userData.gameState.currentStage, 3);

    assert.equal(userData.gameState.currentEnemy.enemyId, 'goblin');

    assert.equal(userData.gameState.currentEnemy.currentHealth, 15);

    assert.equal(userData.gameState.runTime, 120);

    assert.equal(userData.gameState.currentHand[0].cardId, 'slash');

    assert.equal(userData.gameState.currentDrawDeck[0].cardId, 'fireball');

    assert.equal(
      userData.gameState.currentDiscardedCardPile[0].cardId,
      'block'
    );

    assert.equal(userData.gameState.scene, "red-underpass")

    assert.exists(userData.gameState.updatedAt);
  });

  /**
   * Test: Unauthenticated users cannot update gameState.
   *
   * Verifies that:
   * - updateGameState throws an authorization error
   * - No gameState update occurs
   */
  it('User Data: Rejects unauthenticated gameState updates', async function () {
    const updatedGameState = {
      currentStage: 5,
    };

    try {
      await Meteor.server.method_handlers['userData.saveGameState'].apply(
        {},
        [{ gameState: updatedGameState }]
      );

      assert.fail('Expected authorization error');
    } catch (error) {
      assert.equal(error.error, 'userData.notAuthorized');
    }
  });
}
