import mongoose from "mongoose";

const userModel = mongoose.model("User", { name: String });

const data = await userModel.findOne({ name: "Amit" });
console.log(data)