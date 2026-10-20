import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

await client.connect();

const db = client.db();
const collection = db.collection("users");

// const result = await db.command({
//   validate: "users",
// });

const collectionInfo = await db.listCollections({ name: "users" }).toArray();

const schema = collectionInfo[0].options.validator.$jsonSchema;
console.log(schema);

const invalidDocs = await collection
  .find({
    $nor: [
      {
        $jsonSchema: schema,
      },
    ],
  })
  .toArray();

console.log(invalidDocs);

client.close();
