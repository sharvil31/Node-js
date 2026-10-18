import { MongoClient, ObjectId } from "mongodb";

// const client = new MongoClient("mongodb://127.0.0.1:27017");
// const client = new MongoClient("mongodb://127.0.0.1:27017/storageApp");
// const client = new MongoClient("mongodb://127.0.0.1:27017/admin");
const client = new MongoClient("mongodb://127.0.0.1:27017/newDB");

await client.connect();

const db = client.db();

// const result = await db.command({ listCommands: 1 });
// const result = await db.command({ listDatabases: 1 });
// const result = await db.command({ listCollections: 1 });

// create collection
// const result = await db.command({ create: "Grains" });
const result = await db.command({ drop: "Grains" });
console.log(result);
// console.log(result.cursor.firstBatch);

client.close();
