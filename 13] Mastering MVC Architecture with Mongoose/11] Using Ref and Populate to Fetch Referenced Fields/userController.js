import User from "./UserModel.js";

// const user = await User.findOne({ email: "aditya@gmail.com" }).populate("parentId");
const user = await User.findOne({ email: "aditya@gmail.com" }).populate({
  path: "parentId",
  select: "name age -_id"
});

console.log(user);
