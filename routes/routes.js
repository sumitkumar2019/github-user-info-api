const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err) {
        const error = new Error("An Error occurred");
        return next(error);
      }
      if (!user) {
        const message = "Either Username or Password is Incorrect";
        return res.json({ message });
      }

      req.login(user, { session: false }, async error => {
        if (error) return next(error);
        const body = { id: user.id, username: user.username };
        const token = jwt.sign({ user: body }, "top_secret");
        const message = "Login Successful";
        return res.json({ token, message });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});
router.post("/signup", async (req, res, next) => {
  passport.authenticate(
    "local-signup",
    { session: false },
    async (err, user, info) => {
      try {
        if (err) {
          const error = new Error("An Error occurred");
          return next(error);
        }
        if (!user) {
          const message = "User Already Available";
          return res.json({ message });
        } else {
          return res.json({
            message: "Signup successful",
            user: user
          });
        }
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next);
});

module.exports = router;
