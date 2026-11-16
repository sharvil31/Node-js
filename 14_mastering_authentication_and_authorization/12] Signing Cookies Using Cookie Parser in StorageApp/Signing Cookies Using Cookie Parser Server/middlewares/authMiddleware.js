import User from "../models/userModel.js";

export default async function checkAuth(req, res, next) {
  // console.log("Signed", req.signedCookies);
  // console.log("Normal", req.cookies);
  const { token } = req.signedCookies;

  if (!token) {
    res.clearCookie("token");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id, expiry: expiryTimeInSeconds } = JSON.parse(
    Buffer.from(token, "base64url").toString(),
  );
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
