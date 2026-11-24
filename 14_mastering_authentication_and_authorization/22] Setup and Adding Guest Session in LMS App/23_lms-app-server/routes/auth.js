import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Session from "../models/Session.js";
import Cart from "../models/Cart.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const sessionId = req.signedCookies.sid;
    // find guest user session
    const session = await Session.findById(sessionId);

    // if session doesn't exist create a new one
    if (session) {
      // update session expiry time
      session.expires = Math.round(Date.now() / 1000) + 60 * 60 * 24 * 30;
      // after login update userId in session with logged in user's id to mark session that it belongs to this logged in user now.
      session.userId = user._id;

      // check if user already has a cart means is he logged in before
      const cart = await Cart.findOne({ userId: user._id });

      // if cart present then add session cart items to cart from user's new guest session.
      if (cart) {
        cart.courses = cart.courses.map(({ courseId, quantity }) => {
          const foundSessionCourse = session.data.cart.find(
            (course) => courseId.equals(course.courseId),
          );

          if (foundSessionCourse) {
            return {
              courseId,
              quantity: quantity + foundSessionCourse.quantity,
            };
          }

          return { courseId, quantity };
        });
        //     const result = await Cart.updateOne(
        //   {
        //     userId: session.userId,
        //     "courses.courseId": courseId,
        //   },
        //   { $inc: { "courses.$.quantity": 1 } },
        // );

        // if (result.matchedCount === 0) {
        //   await Cart.updateOne(
        //     { userId: session.userId },
        //     { $push: { courses: { courseId, quantity: 1 } } },
        //   );
        // }
        await cart.save();
      } else {
        // if cart not present then create a new cart in cart collection and move all cart item to cart collection from session.
        const result = await Cart.create({
          userId: user._id,
          courses: session.data.cart,
        });

        console.log(result);
      }

      // after moving empty data.cart from session
      session.data = {};
      await session.save();

      res.cookie("sid", session.id, {
        httpOnly: true,
        signed: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });

      return res.json({
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      });
    }

    // if session doesn't exist create a new one
    const newSession = await Session.create({ userId: user._id });
    res.cookie("sid", newSession.id, {
      httpOnly: true,
      signed: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/profile", async (req, res) => {
  try {
    const sessionId = req.signedCookies.sid;
    const session = await Session.findById(sessionId);

    if (!session || !session.userId) {
      return res.status(404).json({ error: "User not logged in" });
    }

    const user = await User.findById(session.userId).lean();

    res.json({
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
