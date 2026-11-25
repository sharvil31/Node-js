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
      const guestCourses = session.data.cart || [];
      if (cart) {
        for (const guestCourse of guestCourses) {
          const existingCourse = cart.courses.find(
            (course) =>
              course.courseId.toString() === guestCourse.courseId.toString(),
          ); // .find return the actual object reference, not a copy

          if (existingCourse) {
            existingCourse.quantity += guestCourse.quantity; // changed existingCourse quantity will also change cart course quantity cause existingCourse references the cart course object. both are pointing to same object in memory.
          } else {
            cart.courses.push(guestCourse);
          }
        }

        // another solution using new Map()

        // const coursesMap = new Map();

        // // add existing user cart courses to map
        // for (const course of cart.courses) {
        //   coursesMap.set(course.courseId.toString(), {
        //     courseId: course.courseId,
        //     quantity: course.quantity,
        //   });
        // }
        // // Merge guest cart courses
        // for (const course of guestCourses) {
        //   const courseId = course.courseId.toString();

        //   if (coursesMap.has(courseId)) {
        //     coursesMap.get(courseId).quantity += course.quantity;
        //   } else {
        //     coursesMap.set(courseId, {
        //       courseId: course.courseId,
        //       quantity: course.quantity,
        //     });
        //   }
        // }
        // // Convert Map values back to an array
        // cart.courses = Array.from(coursesMap.values());

        await cart.save();
      } else {
        // if cart not present then create a new cart in cart collection and move all cart item to cart collection from session.
        const result = await Cart.create({
          userId: user._id,
          courses: session.data.cart,
        });

        console.log(result);
      }

      // after moving clear data.cart from session
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
