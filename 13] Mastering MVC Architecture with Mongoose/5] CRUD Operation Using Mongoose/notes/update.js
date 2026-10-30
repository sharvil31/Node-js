import User from "../userModel";

const user = await User.findOne({ email: "ankit@gmail.com" }); // return query - its like a cursor of monodb - its a thenable object
user.age = 15;
user.save(); // two db calls - find and update - inefficient

// 2
const user1 = await User.findOneAndUpdate(
  { email: "ramesh@gmail.com" },
  { age: 5 },
  { returnDocument: "after", runValidators: true },
);
