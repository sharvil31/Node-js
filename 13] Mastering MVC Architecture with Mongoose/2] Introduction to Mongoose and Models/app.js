import mongoose from "mongoose";

await mongoose.connect("mongodb://admin:admin@localhost");

mongoose.set("autoCreate", false);
const userModel = mongoose.model("User", {name: String, age: Number});
const data = await userModel.insertOne({ name: "Sharvil", age: "123" });
console.log(data);

console.log("Database connected");
