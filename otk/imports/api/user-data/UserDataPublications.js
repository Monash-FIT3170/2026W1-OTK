import { Meteor } from "meteor/meteor";
import { UserDataCollection } from "./collections/UserDataCollection";
 
Meteor.publish("userData", function () {
  const userId = this.userId;
  if (!userId) {
    return this.ready();
  }
  return UserDataCollection.find({ userId });
});