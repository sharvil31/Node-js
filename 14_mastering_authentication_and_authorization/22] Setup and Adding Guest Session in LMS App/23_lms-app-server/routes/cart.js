import express from "express";
import Session from "../models/Session.js";
import Course from "../models/Course.js";

const router = express.Router();

// GET cart
router.get("/", async (req, res) => {
  const sessionId = req.signedCookies.sid;
  // find guest user session
  const session = await Session.findById(sessionId);
  // get added courses Ids
  const courseIds = session.data.cart.map(({ courseId }) => courseId);
  // find courses in courses collection
  const courses = await Course.find({ _id: { $in: courseIds } });

  // create response with required fields for frontend
  const cartCourses = courses.map(({ id, name, image, price }) => {
    // find quantity of course from cart
    const { quantity } = session.data.cart.find(
      ({ courseId }) => courseId === id,
    );
    // return course object with required fields
    return {
      id,
      name,
      image,
      price,
      quantity,
    };
  });

  res.json(cartCourses);
});

// Add to cart
router.post("/", async (req, res) => {
  const sessionId = req.signedCookies.sid;
  const courseId = req.body.courseId;
  console.log(req.signedCookies.sid);
  console.log(req.body.courseId);
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
  res.json({message: "Cart item deleted successfully"})
});

// Clear cart
router.delete("/", async (req, res) => {
  //Add your code here
});

export default router;
