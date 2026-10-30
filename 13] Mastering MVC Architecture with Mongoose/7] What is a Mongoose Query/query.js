import User from "./userModel.js";

// const query = User.find({ email: "shyam@gmail.com" }, { name: 1 });
// const query = User.find({ email: "shyam@gmail.com" });
// const query = User.find();
// const query = User.find({ age: { $gte: 15 } });
const query = User.where("age")
  .gte(12)
  .lte(15)
  .select("name age")
  .sort({ age: -1 })
  .exec();

// query.select("name age");
// query.select({ name: 1 });
// query.select("-name");
// query.select("name age").sort({ age: -1 });

// console.log(query.projection());
// console.log(query.getQuery());

console.log(await query);
// console.log(await query.exec());
