import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [
        3,
        "name field should be a string with at least 3 characters",
      ],
    },
    email: {
      type: String,
      required: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minLength: 4,
    },
    rootDirId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Directory",
    },
  },
  { strict: "throw" },
);

const User = model("User", userSchema);

export default User;
