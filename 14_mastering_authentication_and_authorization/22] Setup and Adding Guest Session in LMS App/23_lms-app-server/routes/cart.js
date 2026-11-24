import express from "express";
import Session from "../models/Session.js";
import Cart from "../models/Cart.js";

const router = express.Router();

// GET cart
router.get("/", async (req, res) => {
  const sessionId = req.signedCookies.sid;
  // find guest user session and populate courseId with course details.(ref "Course" defined in Session Model)
  const session =
    await Session.findById(sessionId).populate("data.cart.courseId");

  if (!session) {
    return res.status(404).json({ error: "User not logged in" });
  }

  // If user is not logged in then fetch cart details from session.
  if (!session.userId) {
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

    // return course object with required fields as a response
    return res.json(cartCourses);
  }

  // if user is looged in then find user's cart and populate courseId with course details.(ref "Course" defined in Cart Model)
  const data = await Cart.findOne({ userId: session.userId }).populate(
    "courses.courseId",
  );

  const cartCourses = data.courses.map(({ courseId, quantity }) => {
    const { id, name, image, price } = courseId;
    return {
      id,
      name,
      image,
      price,
      quantity,
    };
  });

  // return course object with required fields as a response
  return res.json(cartCourses);

  // If user is not logged in then we send cart details to frontend from guest session. If user is logged in then we send cart details from cart collection cause after logged in we are marking guest session as login user session by updating userId with logged user's id and moving all cart data to separate cart collection.
});

// Add to cart
router.post("/", async (req, res) => {
  const sessionId = req.signedCookies.sid;
  const courseId = req.body.courseId;

  const session = await Session.findById(sessionId);

  if (session.userId) {
    const result = await Cart.updateOne(
      {
        userId: session.userId,
        "courses.courseId": courseId,
      },
      { $inc: { "courses.$.quantity": 1 } },
    );

    if (result.matchedCount === 0) {
      await Cart.updateOne(
        { userId: session.userId },
        { $push: { courses: { courseId, quantity: 1 } } },
      );
    }

    return res.status(201).json({ message: "Course added to the cart" });
  }

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
