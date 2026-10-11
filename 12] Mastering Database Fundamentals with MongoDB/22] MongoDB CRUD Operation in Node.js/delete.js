import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017/");

await client.connect();

const db = client.db("school2");

// Delete a collection
// const studentsCollection = db.collection("students");
// const a = await studentsCollection.drop();
// console.log(a);

// Delete a document
// const teachersCollection = db.collection("teachers");
// const a = await teachersCollection.deleteOne({
//   _id: new ObjectId("6acb4ebb725efa8101c989af"),
// });
// console.log(a);

// Delete a field/property in a document
// const teachersCollection = db.collection("teachers");
// const a = await teachersCollection.updateOne(
//   {
//     _id: new ObjectId("6acb4ebb725efa8101c989ae"),
//   },
//   { $unset: { age: "" } },
// );
// console.log(a);

// Delete a database
const a = await db.dropDatabase();
console.log(a);

client.close();
