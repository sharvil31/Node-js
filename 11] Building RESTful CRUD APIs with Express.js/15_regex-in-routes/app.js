import express from "express";

const app = express();

// app.get(/^\/(\d+)$/, (req, res) => {
//   // console.log(req.params)
//   res.json({ double: req.params[0] * 2 });
// });

// app.get("/:id([0-9])", (req, res) => {
//   res.json({ message: "Hello Directory" });
// });

// app.get("/directory|folder", (req, res) => {
//   res.json({ message: "Hello Directory" });
// });

// Using Arrays to Define Multiple Routes
app.get(["/directory", "/folder", "/test", /\d/], (req, res) => {
  res.json({ message: "Hello Directory" });
});

// app.get("/folder", (req, res) => {
//   res.json({ message: "Hello Directory" });
// });


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
