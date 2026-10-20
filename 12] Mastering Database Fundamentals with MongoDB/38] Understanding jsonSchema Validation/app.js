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
    $jsonSchema: {
      required: ["name", "age"],
      properties: {
        _id: {
          bsonType: "objectId",
        },
        name: {
          bsonType: "string",
          minLength: 3,
        },
        age: {
          bsonType: "int",
          minimum: 18,
          maximum: 80,
        },
      },
      additionalProperties: false,
    },
  },
});

const collections = await db.listCollections().toArray();
console.log(collections[0].options);

try {
  await collection.insertOne({ name: "Sarvesh", age: "90" });
} catch (error) {
  console.log(error);
}

client.close();
