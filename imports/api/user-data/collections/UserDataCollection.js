import { Mongo } from "meteor/mongo";

export const UserDataCollection = global.UserDataCollection || (global.UserDataCollection = new Mongo.Collection("userData"));