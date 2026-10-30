import User from "./userModel.js";

const user = await User.findOneAndDelete({ email: "ramesh@gmail.com" });

console.log(user);
