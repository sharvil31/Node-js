import { MongoClient, ObjectId } from "mongodb";

const oid1 = new ObjectId("6acdaacdafd838c95d91b722");
const oid2 = new ObjectId("6acdaacdafd838c95d91b722");

// console.log(oid1.buffer.toString());
// console.log(oid1 === oid2);
// console.log(oid1.toString() === oid2.toString());
// console.log(oid1.equals(oid2));
console.log(ObjectId.isValid("6acdaacdafd838c95d91b722"));

// const oid = new ObjectId()

// console.log(ObjectId);

// const client = new MongoClient("mongodb://127.0.0.1:27017/storageApp");

// await client.connect();

// const db = client.db();
// const collection = db.collection("users");
// const data = await collection.findOne();
// console.log(data);
// client.close();
