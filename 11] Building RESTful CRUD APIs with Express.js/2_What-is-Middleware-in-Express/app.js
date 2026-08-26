import express from "express";

const app = express();

app.get(
  "/",
  // Request Handler Middleware - 3 params
  (req, res, next) => {
    try {
      console.log("Running Middleware 1");
      // next();
      console.log(object)
      res.end("Hii");
      // next();
    } catch (error) {
      // next("");
      // next(0);
      // next(undefined);
      next(error); // calls error handler midleware when a truthy value is passed in next
      // if next is not called and error occurred then error handler middleware automatically calls
    }
  },

  // Error Handler Middleware - 4 params
  (err, req, res, next) => {
    console.log({ err: err.message });
    console.log("Running Error Middleware");
    res.end(err.message);
  },

  // Request Handler Middleware - 2 params
  (req, res) => {
    console.log("Running Middleware 2");
    res.write("Hello World! 2");
  },

  // Error Handler Middleware - 4 params
  (err, req, res, next) => {
    console.log("Running Error Middleware");
    res.end("Error Found");
  },
);

app.listen(4000, () => {
  console.log(`Example app listening on port 4000`);
});
