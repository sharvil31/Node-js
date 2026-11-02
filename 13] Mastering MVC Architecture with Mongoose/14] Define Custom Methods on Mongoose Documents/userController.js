import mongoose from "mongoose";
import User from "./UserModel.js";

const user = await User.findOne({ email: "aditya@gmail.com" });

// console.log(user.getSummary())
console.log(user.getSummary("full"))

await mongoose.disconnect();
