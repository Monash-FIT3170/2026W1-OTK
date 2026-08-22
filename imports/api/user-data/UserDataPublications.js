import { Meteor } from "meteor/meteor";
import { UserDataCollection } from "./collections/UserDataCollection";
 
// Meteor.publish only exists on the server. This module is reached from the
// client test bundle via tests/main.js, so the registration must be guarded.
if (Meteor.isServer) {
  Meteor.publish("userData", function () {
    const userId = this.userId;
    if (!userId) {
      return this.ready();
    }
    return UserDataCollection.find({ userId });
  });
}