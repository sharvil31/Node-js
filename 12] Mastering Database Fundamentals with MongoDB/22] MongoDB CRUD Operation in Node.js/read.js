import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017/");

await client.connect();

const db = client.db("todoApp");
// console.log(await db.listCollections().toArray());

const collection = db.collection("todos");

// Read
const todosData = await collection.find({ completed: false }).toArray();
console.log(todosData);

client.close();
