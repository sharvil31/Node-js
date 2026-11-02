import mongoose from "mongoose";
import User from "./UserModel.js";

const user = await User.findOne({ email: "ramesh@gmail.com" });

// console.log(user.id);
// console.log(user.toJSON().id);
// console.log(user.toJSON({ virtuals: true }));
// console.log(user.schema.virtuals);
// console.log(User.schema.virtuals);
// console.log(user.isAdult)
// user.hobbiesInString = "Farming, Kabaddi";
// console.log(user.hobbiesInString);
// await user.save();
// console.log(user.emailDomain);
console.log(user);
console.log(user.toJSON());
console.log(user.toObject());

await mongoose.disconnect();
