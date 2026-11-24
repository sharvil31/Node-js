import express from "express";
import Session from "../models/Session.js";
import Course from "../models/Course.js";

const router = express.Router();

// GET cart
router.get("/", async (req, res) => {
  const sessionId = req.signedCookies.sid;
  // find guest user session
  const session =
    await Session.findById(sessionId).populate("data.cart.courseId");

  // console.log(session.data.cart);

  if (!session) {
    return res.status(404).json({ error: "User not logged in" });
  }
  // get added courses Ids
  const cartCourses = session.data.cart.map(({ courseId, quantity }) => {
    const { id, name, image, price } = courseId;
    return {
      id,
      name,
      image,
      price,
      quantity,
    };
  });

  // return course object with required fields
  res.json(cartCourses);
});

// Add to cart
router.post("/", async (req, res) => {
  const sessionId = req.signedCookies.sid;
  const courseId = req.body.courseId;

  const result = await Session.updateOne(
    {
      _id: sessionId,
      "data.cart.courseId": courseId,
    },
    { $inc: { "data.cart.$.quantity": 1 } },
  );

  if (result.matchedCount === 0) {
    await Session.updateOne(
      { _id: sessionId },
      { $push: { "data.cart": { courseId, quantity: 1 } } },
    );
  }
  // session.data.cart.push({
  //   courseId: req.body.courseId,
  //   quantity: 1,
  // });

  // session.markModified("data"); // mongoose doesn't track nested document if we update using push. We need to explicitely tell with markModified.
  // await result.save();
  console.log(result);
  res.status(201).json({ message: "Course added to the cart" });
});

// Remove course from cart
router.delete("/:courseId", async (req, res) => {
  const sessionId = req.signedCookies.sid;
  const courseId = req.params.courseId;

  const result = await Session.updateOne(
    { _id: sessionId },
    { $pull: { "data.cart": { courseId } } },
  );

  console.log(result);
  res.json({ message: "Cart item deleted successfully" });
});

// Clear cart
router.delete("/", async (req, res) => {
  //Add your code here
});

export default router;
