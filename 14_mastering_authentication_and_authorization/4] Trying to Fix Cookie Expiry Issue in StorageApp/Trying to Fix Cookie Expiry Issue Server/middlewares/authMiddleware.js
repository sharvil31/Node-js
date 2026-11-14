import { ObjectId } from "mongodb";
import User from "../models/userModel.js";

export default async function checkAuth(req, res, next) {
  console.log(req.cookies);
  const { uid } = req.cookies;
  if (!uid) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id, expiry } = JSON.parse(uid);
  console.log(id, expiry);
  const expiryTimeInSeconds = parseInt(uid.substr(24, 32), 16);
  const currentTimeInSeconds = Math.round(Date.now() / 1000);
  if (currentTimeInSeconds > expiryTimeInSeconds) {
    res.clearCookie("uid");
    return res.status(401).json({ message: "Session Expired!" });
  }
  const user = await User.findOne({ _id: uid.substr(0, 24) }).lean();
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.user = user;
  next();
}
