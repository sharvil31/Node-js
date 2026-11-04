import mongoose from "mongoose";
import User from "./UserModel.js";

const user1 = await User.findOne({ email: "vishwajeet@gmail.com" });
const user2 = await User.findOne({ email: "vishwajeet@gmail.com" });

// user1.hobbies.splice(0, 1);
// console.log(user1.hobbies);

console.log(user1.__v);
user1.balance += 500;
await user1.save();
console.log(user1.__v);

// user2.hobbies.splice(1, 1);
// console.log(user2.hobbies);

console.log(user2.__v);
user2.balance += 200;
await user2.save();
console.log(user2.__v);

await mongoose.disconnect();
