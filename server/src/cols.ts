import { MongoClient, ObjectID } from "mongodb";
import { HistoryGame, User } from "../../client/src/User/usertypes";
import { uri } from "../config";

const client = new MongoClient(uri, { useUnifiedTopology: true });

interface UserDB extends User {
  _id: ObjectID;
}

export const getUsers = async () => {
  await client.connect();
  const oopdb = client.db("checkts");
  return oopdb.collection<UserDB>("users");
};
export const getGames = async () => {
  await client.connect();
  const oopdb = client.db("checkts");
  return oopdb.collection<HistoryGame>("games");
};
