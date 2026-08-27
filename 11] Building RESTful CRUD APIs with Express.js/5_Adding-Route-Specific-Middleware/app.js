import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  console.log(req.url);
  res.end("Home Route");
});

app.get("/login", (req, res) => {
  res.end("Logged in");
});

// when we request on /login then app.use also runs even if we define it for "/" request.
// there are two things routeName and req.url
// routeName means on which url request came and req.url means from which url request came
// to handle HTTP methods we get get, post, etc. methods on middleware in express. This methods check condition like this req.url === routeName when matches only then it goes in correct middleware

// e.g.
app.use("/users", (req, res) => {
  res.end("First");
});

app.use("/users/1", (req, res) => {
  res.end("Second");
});

// Here if we request on "/users/1" then alao "/users" middleware will be called
// if we change the order means define "users/1" on above "/users" then in that case "users/1" will be called.
// Where regular get, post middlewares compare requests as req.url === routeName. the global app.use middleware checks similar as req.url.startWith(routeName) means req.url is starting with routeName
// middlewares are checked in order
// in first case "/users/1".startsWith("/users") becomes true
// behind the scenes it doesnt use startsWith method cause "/users/1".startsWith("/user") will also returns true. and if we send request on /user it will not go in first middleware "/users" but idea is same

// Adding Route-Specific Middleware
app.use("/admin", (req, res, next) => {
  console.log(req.url); // prints "/"
  console.log(req.originalUrl); // prints "/admin"
  if (req.body.password === "secret") {
    next();
  } else {
    res.end("Invalid Credentials");
  }
});

app.post("/admin", (req, res) => {
  res.end("Hello Admin");
});

app.listen(4000, () => {
  console.log(`Example app listening on port 4000`);
});
