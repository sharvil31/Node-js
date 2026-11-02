import mongoose from "mongoose";
import User from "./UserModel.js";

const user = await User.findOneByName("Ramesh");
console.log(user)

await mongoose.disconnect();
