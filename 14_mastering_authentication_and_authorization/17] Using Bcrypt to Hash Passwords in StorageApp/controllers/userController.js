import User from "../models/userModel.js";
import Directory from "../models/directoryModel.js";
import mongoose, { Types } from "mongoose";
import crypto from "node:crypto";

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  const session = await mongoose.startSession();

  // hashing password with pbkdf2
  const salt = crypto.randomBytes(16);
  const hashedPassword = crypto.pbkdf2Sync(
    password,
    salt,
    100000,
    32,
    "sha256",
  );

  try {
    const rootDirId = new Types.ObjectId();
    const userId = new Types.ObjectId();

    // startTransaction()
    session.startTransaction();

    await Directory.insertOne(
      {
        _id: rootDirId,
        name: `root-${email}`,
        parentDirId: null,
        userId,
      },
      { session },
    );

    await User.insertOne(
      {
        _id: userId,
        name,
        email,
        password: `${salt.toString("base64url")}.${hashedPassword.toString("base64url")}`,
        rootDirId,
      },
      { session },
    );

    // transaction will not commit if error occurs
    session.commitTransaction();

    res.status(201).json({ message: "User Registered" });
  } catch (err) {
    session.abortTransaction();
    console.log(err);
    // field validation error
    if (err.code === 121) {
      res.status(400).json({
        error: "Invalid value, Please enter valid details",
        details: err,
      });
    } else if (err.code === 11000) {
      if (err.keyValue.email) {
        return res.status(409).json({
          error: "User already exists",
          message:
            "A user with this email address already exists. Please try logging in or use a different email.",
        });
      }
    } else {
      next(err);
    }
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).lean();

  if (!user) {
    return res.status(404).json({ error: "Invalid Credentials" });
  }

  const [salt, savedHashedPassword] = user.password.split(".");

  const enteredPasswordHash = crypto
    .pbkdf2Sync(password, Buffer.from(salt, "base64url"), 100000, 32, "sha256")
    .toString("base64url");

  if (savedHashedPassword !== enteredPasswordHash) {
    return res.status(404).json({ error: "Invalid Credentials" });
  }

  const cookiePayload = JSON.stringify({
    id: user._id.toString(),
    expiry: Math.round(Date.now() / 1000 + 100000),
  });

  res.cookie("token", Buffer.from(cookiePayload).toString("base64url"), {
    httpOnly: true,
    signed: true,
    maxAge: 60 * 1000 * 60 * 24 * 7,
  });
  res.json({ message: "logged in" });
};

export const getCurrentUser = (req, res) => {
  res.status(200).json({
    name: req.user.name,
    email: req.user.email,
  });
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(204).end();
};
