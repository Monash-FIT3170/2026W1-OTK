import { Meteor } from "meteor/meteor";
import { UserDataCollection } from "../collections/UserDataCollection";
import { check } from 'meteor/check';
 
Meteor.methods({
  "userData.registerUser": async function ({ userId }) {
    check(userId, String);

    const existingUserData = await UserDataCollection.findOneAsync({ userId: userId });
    if (existingUserData) {
      console.log('Existing user data check:', existingUserData);
      throw new Meteor.Error('userData.userIdExists', 'There already exists user data for this user.');
    }

    return UserDataCollection.insertAsync({
      userId: userId,
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