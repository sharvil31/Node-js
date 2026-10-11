import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017/");

await client.connect();

const db = client.db("expenseApp");
// const collectionsList = await db.listCollections().toArray();
// console.log(collectionsList);

const collection = db.collection("expenses");
const fruits = await collection.find().toArray();
console.log(fruits);