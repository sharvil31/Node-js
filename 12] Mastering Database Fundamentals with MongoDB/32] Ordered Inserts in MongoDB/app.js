import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

await client.connect();

const db = client.db();
const collection = db.collection("users");

// await collection.insertMany([
//   { name: "Sharvil" },
//   { name: "Akash" },
//   { name: "Amit" },
//   { name: "Rakesh" },
// ]);

// const result = await collection.insertMany([
//   { name: "Sahil" },
//   { _id: new ObjectId("6ad490081cad99d1479084c4"), name: "Ganesh" }, // inserted duplicate id of Akash
//   { name: "Rishi" },
//   { name: "Prabhulal" },
// ]);

const result = await collection.insertMany(
  [
    { name: "Nihal" },
    { _id: new ObjectId("6ad490081cad99d1479084c4"), name: "Ganesh" }, // inserted duplicate id of Akash
    { name: "Rishi" },
    { name: "Prabhulal" },
  ],
  { ordered: false }, // default true
);

console.log(result);
client.close();
