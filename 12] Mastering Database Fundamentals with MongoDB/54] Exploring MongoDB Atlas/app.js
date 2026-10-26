import { MongoClient } from "mongodb";

// const connectionUrl = "mongodb://anurag:anurag@127.0.0.1:27018/storageApp";
const connectionUrl =
  "mongodb+srv://amburlesarvil_db_user:MZ1iJl5R1cVNuOYz@cluster0.diuwrlv.mongodb.net/storageApp";

const client = new MongoClient(connectionUrl);

await client.connect();

const db = client.db();
const collection = db.collection("users");
const data = await collection.find().toArray();
// await collection.insertOne({ name: "Anurag" });

console.log(data);
client.close();
