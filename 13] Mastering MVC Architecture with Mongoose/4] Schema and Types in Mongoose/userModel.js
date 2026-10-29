import mongoose, { Schema } from "mongoose";

// const userSchema = {
//   name: {
//     type: String,
//     required: [true, "name field is required."],
//     minLength: [3, "name should contain minimum 3 letters"],
//   },

//   age: { type: Number, required: [true, "age is required."], min: 18 },

//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     match: [
//       /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
//       "Please enter a valid email",
//     ],
//   },
// }

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name field is required."],
      minLength: [3, "name should contain minimum 3 letters"],
      trim: true,
    },
    age: { type: Number, required: [true, "age is required."], min: 12 },
    email: {
      type: String,
      required: true,
      //   unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
        "Please enter a valid email",
      ],
      lowercase: true,
      trim: true,
    },
    hobbies: [String],
    parentId: {
      type: Schema.Types.ObjectId,
      required: [
        function () {
          return this.age < 16; // this refers to insertOne Object.
        },
        "ParentId is required if age is less than 16 years.",
      ],
      default: null,
    },
  },
  {
    strict: "throw",
    timestamps: true,
    // versionKey: false, // cannot set to true. either string or falsy
    // versionKey: "__version",
    // collection: "test",
  },
  //   { strict: false },
);

const User = mongoose.model("User", userSchema);

const data = await User.insertOne({
  name: "Ankit",
  age: 14,
  email: "ankit@gmail.com",
  hobbies: ["Coding"],
  parentId: "6ae37e3f16f2fbea19df3b86",
});
console.log(data);

// In app.js, first userModal.js will run. In userModal there is await keyword present. So, userModal file stops running temporarily and db.js file starts executing. In db.js databse will get connected and after database connection userModal promise will be resolved and userModel file will finish remaining execution.
