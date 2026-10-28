import mongoose from "mongoose";

await mongoose.connect("mongodb://admin:admin@localhost");

const UserModel = mongoose.model("User", { name: String, age: Number }, "Dogs");

// const data = await UserModel.insertOne({});
// console.log(data);

console.log("Database connected");
