import mongoose from "mongoose";

await mongoose.connect("mongodb://admin:admin@localhost");

// const db = mongoose.connection.db;

// const fruitsConnection = db.collection("fruits");

// const result = await fruitsConnection.insertOne({ name: "mango" });

// console.log(result);

mongoose.connection.on("connected", () => console.log("connected"));
mongoose.connection.on("open", () => console.log("open"));
mongoose.connection.on("disconnected", () => console.log("disconnected"));
mongoose.connection.on("reconnected", () => console.log("reconnected"));
mongoose.connection.on("disconnecting", () => console.log("disconnecting"));
mongoose.connection.on("close", () => console.log("close"));

await mongoose.disconnect();
