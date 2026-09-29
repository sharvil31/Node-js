import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 4000;

app.use(cookieParser());
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  console.log(req.headers.cookie);
  console.log(req.cookies);
  // res.set({
  //   "Set-Cookie": [
  //     `name=Sharvil;SameSite=None;secure`,
  //     `age=23;SameSite=None;secure`,
  //     `email=sharvil@gmail.com;SameSite=None;secure`,
  //   ],
  // });

  res.cookie("name", "Sharvil", {
    sameSite: "none",
    secure: true,
    maxAge: 60 * 1000 * 60,
  });
  res.cookie("age", "23", {
    sameSite: "none",
    secure: true,
    maxAge: 60 * 1000 * 60,
  });
  res.cookie("email", "sharvil@gmail.com", {
    sameSite: "none",
    secure: true,
    maxAge: 60 * 1000 * 60,
  });
  res.json({ message: "Hello World!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
