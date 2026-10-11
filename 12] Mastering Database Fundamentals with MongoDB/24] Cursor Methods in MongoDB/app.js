import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017/");

await client.connect();

const db = client.db("expenseApp");
const collection = db.collection("expenses");
// const cursor = collection.find().skip(1);
// const cursor = collection.find({ title: "Books" }).skip(1).limit(5);
// const cursor = collection.find().skip(0).limit(5).sort({ title: 1 });
const cursor = collection
  .find()
  .skip(2)
  .limit(0)
  .sort({ title: 1 })
  .filter({ title: "Books" })
  .map(({ title, amount }) => ({ title, amount })); // runs on client. doesn't go to server

const data = await cursor.toArray();
console.log(data);

client.close();
