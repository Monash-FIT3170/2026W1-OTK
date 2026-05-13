import { Meteor } from 'meteor/meteor';
import { UserDataCollection } from '../collections/UserDataCollection';
import { check } from 'meteor/check';
import { GameEngine } from '../../../engine/GameEngine';

/**
 * Meteor methods for managing user-associated game data.
 *
 * These methods are responsible for:
 * - Creating initial user data entries
 * - Creating default GameState structures
 * - Updating saved GameState progress
 *
 * GameState stores serialisable save data required to reconstruct
 * an active OTK run, including:
 * - Current stage
 * - Current hand
 * - Current enemy
 * - Draw/discard piles
 * - Runtime information
 *
 * Security:
 * - GameState updates are restricted to authenticated users
 * - Each user may only modify their own saved GameState
 *
 * @author Eric Blyth
 * @author Hydar Rabiaa
 * @version 1.1
 */
Meteor.methods({
  /**
   * Registers a new user data entry associated with a user account.
   *
   * This method:
   * - Validates the provided userId
   * - Prevents duplicate user data entries
   * - Creates a default GameState structure for the user
   *
   * The created GameState acts as the initial save structure
   * for the user's OTK run progress.
   *
   * @method userData.registerUser
   *
   * @param {Object} params - User registration data
   * @param {string} params.userId - Meteor account user ID
   *
   * @returns {string} insertedId - ID of the inserted user data document
   *
   * @throws {Meteor.Error} userData.userIdExists
   * Thrown when user data already exists for the provided userId
   *
   * @see UserDataCollection
   */
  'userData.registerUser': async function ({ userId }) {
    check(userId, String);

    const existingUserData = await UserDataCollection.findOneAsync({
      userId: userId,
    });

    if (existingUserData) {
      console.log('Existing user data check:', existingUserData);

      throw new Meteor.Error(
        'userData.userIdExists',
        'There already exists user data for this user.'
      );
    }
    // Initialise a fresh game state for the new user
    const gameState = GameEngine.newGame(userId);
    return UserDataCollection.insertAsync({
      userId: userId,
      gameState,
    });
  },

  /**
   * Updates the saved GameState for the authenticated user.
   *
   * This method overwrites the user's current saved GameState
   * with the provided GameState object.
   *
   * GameState is designed to contain serialisable save data
   * required to reconstruct gameplay state at a later time.
   *
   * Security:
   * - Only authenticated users may update GameState
   * - Users may only update their own GameState
   *
   * @method userData.updateGameState
   *
   * @param {Object} params - GameState update payload
   * @param {Object} params.gameState - Complete GameState object
   *
   * @returns {number} modifiedCount - Number of modified documents
   *
   * @throws {Meteor.Error} userData.notAuthorized
   * Thrown when an unauthenticated user attempts to update GameState
   *
   * @see UserDataCollection
   */
  'userData.updateGameState': async function ({ gameState }) {
    check(gameState, Object);

    if (!this.userId) {
      throw new Meteor.Error(
        'userData.notAuthorized',
        'You must be logged in to update game state.'
      );
    }

    return UserDataCollection.updateAsync(
      { userId: this.userId },
      {
        $set: {
          gameState: {
            ...gameState,
            updatedAt: new Date(),
          },
        },
      }
    );
  },
});
