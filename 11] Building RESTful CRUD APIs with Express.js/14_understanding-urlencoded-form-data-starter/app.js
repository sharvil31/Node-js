import express from "express";

const app = express();

app.use(express.static("public"));
app.use(express.text()); // checks and sets if in header "content-type" has value "text-plain"
app.use(express.urlencoded({ extended: true })); // content-type: application/x-www-form-urlencoded
app.use(express.json()); // parses json data send by javascript

app.post("/user", (req, res) => {
  // console.log(req.header("content-type"));
  // req.on("data", (chunk) => {
  //   console.log("chunk");
  //   console.log(chunk.toString());
  // }); /// will not run app.use(express.text()) already sets data on body
  console.log(req.body);
  res.json({ message: "Got Data" });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
