import User from "../userModel";

const user = await User.findOne({ email: "ankit@gmail.com" }).lean(); // with less properties - if you want to just find record.
const user1 = await User.find().lean();

console.log(user);