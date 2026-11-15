import { mySecretKey } from "../controllers/userController.js";
import User from "../models/userModel.js";
import crypto from "node:crypto";

export default async function checkAuth(req, res, next) {
  // console.log(req.cookies);
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const [payload, signature] = token.split(".");
  const jsonPayload = Buffer.from(payload, "base64url").toString();

  const newSignature = crypto
    .createHash("sha256")
    .update(mySecretKey)
    .update(jsonPayload)
    .update(mySecretKey)
    .digest("base64url");

  if (newSignature !== signature) {
    res.clearCookie("token");
    console.log("Invalid Signature");
    return res.status(401).json({ error: "Not logged in!" });
  }

  const { id, expiry: expiryTimeInSeconds } = JSON.parse(jsonPayload);
  // console.log(id, expiry);
  // const expiryTimeInSeconds = parseInt(token.substr(24, 32), 16);
  const currentTimeInSeconds = Math.round(Date.now() / 1000);
  if (currentTimeInSeconds > expiryTimeInSeconds) {
    res.clearCookie("token");
    return res.status(401).json({ error: "Session Expired!" });
  }
  const user = await User.findOne({ _id: id }).lean();
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.user = user;
  next();
}
