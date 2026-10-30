import User from "../userModel.js";

const data = await User.insertOne({
  name: "Ankit",
  age: 14,
  email: "ankit@gmail.com",
  hobbies: ["Coding"],
  parentId: "6ae37e3f16f2fbea19df3b86",
});

const data1 = await User.create({
  name: "Ankit",
  age: 14,
  email: "ankit@gmail.com",
  hobbies: ["Coding"],
  parentId: "6ae37e3f16f2fbea19df3b86",
});

const data2 = await User.create([
  {
    name: "Ram",
    age: 14,
    email: "  Ram@gmail.com  ",
    hobbies: ["Coding"],
    parentId: "6ae37e3f16f2fbea19df3b86",
  },
  {
    name: "Shyam",
    age: 14,
    email: "  Shyam@gmail.com  ",
    hobbies: ["TT"],
    parentId: "6ae37e3f16f2fbea19df3b86",
  },
]);


const user = new User({
  name: "Jay",
  age: 14,
  email: "Jay@gmail.com",
  hobbies: ["Coding"],
  parentId: "6ae37e3f16f2fbea19df3b86",
}); // When a class/constructor function is called with "new" keyword it always creates an object - plain JS

user.age = 20;
user.hobbies.push("Cooking");

const data3 = await user.save();
console.log(data3);