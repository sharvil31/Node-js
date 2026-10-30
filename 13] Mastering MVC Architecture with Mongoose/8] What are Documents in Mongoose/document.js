import mongoose from "mongoose";
import User from "./UserModel.js";

// const user = new User();

// console.log(user instanceof mongoose.Document);
// console.log(user instanceof User);
// console.log(user.isModified());
// user.age = 10;
// console.log(user.isModified());

// const user = await User.create({});
const user = await User.findById("6ae40fa71e973ab780bed7ff");

// user.updateOne({ age: 50 }).exec();
// await user.deleteOne();

console.log(user.toJSON());
console.log(user.toObject());
