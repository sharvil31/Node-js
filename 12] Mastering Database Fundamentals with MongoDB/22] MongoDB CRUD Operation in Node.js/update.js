import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017/");

await client.connect();

const db = client.db("school");
const studentsCollection = db.collection("students");

// const a = await studentsCollection.updateOne(
//   { _id: new ObjectId("6acb4e8a81f506b06de84a5d") },
//   { $set: { name: "Raman", class: 10, age: 17 } },
// );

const a = await studentsCollection.replaceOne(
  { _id: new ObjectId("6acb4e8a81f506b06de84a5d") },
  { hobbies: ["Reading", "Coding"] },
);
console.log(a);

client.close();
