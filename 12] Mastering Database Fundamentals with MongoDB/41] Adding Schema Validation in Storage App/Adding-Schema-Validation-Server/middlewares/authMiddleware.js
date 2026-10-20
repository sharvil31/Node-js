import { ObjectId } from "mongodb";

export default async function checkAuth(req, res, next) {
  const { uid } = req.cookies;
  const db = req.db;
  if (!uid) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = await db.collection("users").findOne({ _id: new ObjectId(uid) });
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.user = user;
  next();
}
