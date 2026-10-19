import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");
// const client = new MongoClient("mongodb://127.0.0.1:27017/storageApp");
// const client = new MongoClient("mongodb://127.0.0.1:27017/admin");
// const client = new MongoClient("mongodb://127.0.0.1:27017/newDB");

await client.connect();

const db = client.db();
const collection = db.collection("users");

await db.command({
  collMod: "users",
  validator: {
    name: {
      $type: "string",
    },
    age: {
      $type: "int",
      $gte: 18,
      $lte: 80,
    },
  },
  validationAction: "warn"
});

const collections = await db.listCollections().toArray();
console.log(collections[0].options);

// try {
//   await collection.insertOne({ name: "Sarvesh", age: 90 });
// } catch (error) {
//   console.log(error);
// }

client.close();
