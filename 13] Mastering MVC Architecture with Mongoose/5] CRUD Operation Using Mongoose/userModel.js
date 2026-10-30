import { model, Schema } from "mongoose";

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
          return this.age < 16;
        },
        "ParentId is required if age is less than 16 years.",
      ],
      default: null,
    },
  },
  {
    strict: "throw",
    timestamps: true,
  },
);

const User = model("User", userSchema);

export default User