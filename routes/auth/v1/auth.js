const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const { check, validationResult } = require("express-validator");

const User = require("../../../models/User");

// @route GET api/users
// @desc Test route
// @access PUBLIC
router.get("/__test", (req, res) => res.send("auth routes working :)"));

// @route POST /api/auth/v1/login
// @desc LOGIN with email and password
// @access PUBLIC
router.post(
  "/login",
  [
    check("email")
      .isEmail()
      ,
      check('password')
      .isLength({ min: 5 })
      .withMessage('must be at least 5 chars long')
      .matches(/\d/)
      .withMessage('must contain a number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log(email, password)
    // Check if user exists
    try {
      let user = await User.findOne({ email });

      if (user) {
        console.log(user);
       

        const payload = {
          user: {
            id: user.id,
          }
        };

        jwt.sign(payload, config.get("jwtSecret"), { expiresIn: 360000 }, (err, token) => {
          if (err) throw err;
          return res.json({ token });
        });
      } else {
        return res.status(400).json({succeess:false, message:"Invalid email or password"})
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route POST api/auth/v1/signup
// @desc SIGNUP AS USER
// @access PUBLIC
router.post(
  "/signup",
  [
    check("name","Name is required")
    .not()
    .isEmpty(),
    check("email", "Please enter a valid email")
    .isEmail(),
    check('password')
    .isLength({ min: 5 })
    .withMessage('must be at least 5 chars long')
    .matches(/\d/)  
    .withMessage('must contain a number'),
  
  ],
  async (req, res) => {
    console.log('body', req.body)
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const emailRegex = new RegExp(email);
    try {
      let user = await User.findOne({ email: { $regex: emailRegex, $options: "i" }, password: { $exists: true } });

      if (user) {
        return res.status(400).json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name: name,
        role: "user",
        email,
        password
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      user = await user.save();

      return res.status(201).json({success:true, message:'Signup successfully :)'})
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
