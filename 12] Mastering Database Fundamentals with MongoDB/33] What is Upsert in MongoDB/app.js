import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

await client.connect();

const db = client.db();
const collection = db.collection("users");

// const result = await collection.updateOne(
//   { name: "Sharvil" },
//   { $set: { age: 24 } },
// );

const result = await collection.updateOne(
  { name: "Sahil" },
  { $set: { age: 24 } },
  { upsert: true },
);

console.log(result);
client.close();
