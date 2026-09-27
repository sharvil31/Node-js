import express from "express";
import multer from "multer";
import path from "node:path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const id = crypto.randomUUID();
    const extension = path.extname(file.originalname);
    file.id = id;
    cb(null, `${id}${extension}`);
  },
});

const upload = multer({ storage });
// const upload = multer({ dest: "uploads/" });
const app = express();
const PORT = 4000;

// Handling Multiple Files
app.post(
  "/upload",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "bg", maxCount: 5 },
  ]),
  (req, res) => {
    console.log(req.body);
    console.log(req.files);
    res.json(req.files);
  },
);

// Handling Single file
// app.post("/upload", upload.single("profilePic"), (req, res) => {
//   console.log(req.body);
//   console.log(req.file);
//   res.json(req.file);
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
