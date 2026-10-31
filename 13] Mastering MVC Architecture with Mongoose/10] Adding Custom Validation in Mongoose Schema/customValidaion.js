import User from "./UserModel.js";

const user = await User.create({
  name: "Sharvil",
  age: 86,
  email: "sharvil@gmail.com",
});

console.log(user)
