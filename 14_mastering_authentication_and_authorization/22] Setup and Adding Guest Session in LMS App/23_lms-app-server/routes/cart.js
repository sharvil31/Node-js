import express from "express";
import Session from "../models/Session.js";

const router = express.Router();

// GET cart
router.get("/", async (req, res) => {
  //Add your code here
});

// Add to cart
router.post("/", async (req, res) => {
  const session = await Session.findById(req.signedCookies.sid);
  // session.data.cart.push({
  //   courseId: req.body.courseId,
  //   quantity: 1,
  // });

  session.set("data.cart", [
    ...session.data.cart,
    {
      courseId: req.body.courseId,
      quantity: 1,
    },
  ]);

  // session.markModified("data"); // mongoose doesn't track nested document if we update using push. We need to explicitely tell with markModified.
  await session.save();
  console.log(session);
  res.status(201).json({ message: "Course added to the cart" });
});

// Remove course from cart
router.delete("/:courseId", async (req, res) => {
  //Add your code here
});

// Clear cart
router.delete("/", async (req, res) => {
  //Add your code here
});

export default router;
