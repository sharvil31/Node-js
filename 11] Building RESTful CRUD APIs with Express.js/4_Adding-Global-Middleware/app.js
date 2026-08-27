import express from "express";

const app = express();

// Logging body (log request)
// app.use((req, res, next) => {
//   console.log(req.headers);
//   console.log(req.url);
//   next(); // finds which middleware matches and can handle route
// });
// middleware logic - if one middleware matches the request then next middleware will not run until we call next() in that middleware.


// Parsing JSON body (custom middleware)
// app.use((req, res, next) => {
//   req.on("data", (chunk) => {
//     const reqBody = JSON.parse(chunk.toString());
//     req.body = reqBody;
//     next(); // finds which middleware matches and can handle route
//   });
// });

// Express provided global middleware for parsing. (app.use for global middleware + express.json (jsonParser function) for parsing)
app.use(express.json());
console.log(express.json()) // actual middleware is returned by express.json()

app.get("/", (req, res) => {
  res.end("Home Route");
});

app.get("/login", (req, res) => {
  res.end("Logged in");
});

app.get("/user", (req, res) => {
  res.end("Sharvil");
});

app.post("/user", (req, res) => {
  console.log(req.body);
  res.end("Post Sharvil");
});

// app.use((req, res, next) => {
//   console.log(req.headers);
//   console.log(req.url);
//   next(); // finds which middleware matches and can handle route
// });
// middleware logic - if one middleware matches the request then next middleware will not run until we call next() in that middleware.

app.listen(4000, () => {
  console.log(`Example app listening on port 4000`);
});
