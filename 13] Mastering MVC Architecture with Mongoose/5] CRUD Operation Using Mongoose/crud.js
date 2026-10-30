import User from "./userModel.js";

const user = User.findOne({ email: "ankit@gmail.com" }); // return query - its like a cursor of monodb - its a thenable object

console.log(user);
