import { Meteor } from "meteor/meteor";
import { UserDataCollection } from "../collections/UserDataCollection";
import { check } from 'meteor/check';
import { GameEngine } from '../../../engine/GameEngine';

Meteor.methods({
  "userData.registerUser": async function ({ userId }) {
    check(userId, String);

    const existingUserData = await UserDataCollection.findOneAsync({ userId: userId });
    if (existingUserData) {
      console.log('Existing user data check:', existingUserData);
      throw new Meteor.Error('userData.userIdExists', 'There already exists user data for this user.');
    }

    // Initialise a fresh game state for the new user
    const gameState = GameEngine.newGame(userId);
    return UserDataCollection.insertAsync({
      userId: userId,
      gameState,
    });
  },
  /*
  "userData.update[Field]" ({ value }) {
    return UserDataCollection.updateAsync(
      { userId: this.userId },
      { $set: { [field]: value } }
    );
  },
  */
});
