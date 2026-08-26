import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.end("Home Route");
});

app.get("/login", (req, res) => {
  res.end("Logged in");
});

// post route
app.post("/", (req, res) => {
  res.end("Post Home Route");
});

// put route
app.put("/", (req, res) => {
  res.end("Updated");
});

// patch route
app.patch("/", (req, res) => {
  res.end("Updated Partially");
});

// delete route
app.delete("/", (req, res) => {
  res.end("Deleted");
});

app.listen(4000, () => {
  console.log(`Example app listening on port 4000`);
});
