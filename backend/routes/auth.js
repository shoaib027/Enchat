const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const User = require('../models/User');
const ChatID = require('../models/ChatID')
const { body, validationResult } = require('express-validator');
require('dotenv').config();
const SECRET = process.env.JWT_SECRET_TOKEN;
module.exports = (io) => {
  // ROUTE 1: Create a user: POST "/api/auth". Doesn't require Authentication
  router.post('/createuser', [
    body('name', 'Enter a valid name').isString().isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('username', 'Enter a valid username')
      .isLength({ min: 3, max: 20 })
      .matches(/^[a-zA-Z0-9_]+$/),
    body('password', 'Your password is too short').isLength({ min: 5 }),
  ], async (req, res) => {
    const error = validationResult(req);
    // Check if there are validation errors
    let success = false;
    try {
      if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
      }
      let userEmailAvailable = await User.findOne({ email: req.body.email })

      if (userEmailAvailable) {
        return res.status(400).json({ success: success, error: 'User with this email already exists' })
      }

      let usernameAvailable = await User.findOne({ username: req.body.username })

      if (usernameAvailable) {
        return res.status(400).json({ success: success, error: 'User with this username already exists' })
      }

      const salt = bcrypt.genSaltSync(10);
      const secPass = bcrypt.hashSync(req.body.password, salt);
      //Creating a user
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: secPass
      })
      const data = {
        user: {
          id: user.id
        }
      }
      const authToken = jwt.sign(data, SECRET);
      const foundUserID = await User.findOne({ username: req.body.username })
      //Creating the ChatID
      let createChatID;
      if (foundUserID !== null) {
        createChatID = await ChatID.create({
          userID: foundUserID._id,
          chatID: [],
        })

      }
      success = true
      res.json({ success, authToken, createChatID })
    }
    catch (error) {
      res.status(500).send(error.message)
    }
  });

  // ROUTE 2: Authenticate the user for login
  router.post('/login', [
    body('email', 'Enter a valid email'),
    body('password', 'Enter a Password').exists()
  ], async (req, res) => {
    //If there are errors then return bad request and the errors
    let success = false;
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const { email, password } = req.body
    try {
      let user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ success: success, error: "Please try to login with correct credentials" })
      }
      const passwordCompare = await bcrypt.compare(password, user.password)
      if (!passwordCompare) {
        return res.status(400).json({ success: success, error: "Please try to login with correct credentials" })
      }

      data = {
        user: {
          id: user.id
        }
      }

      const authToken = jwt.sign(data, SECRET);
      success = true;
      res.json({ success, authToken })
    } catch (error) {
      res.status(500).send(SECRET)
    }
  })


  // ROUTE 3: Get logged in userDetails using: POST "/api/auth/getuser" . Login Required
  router.post('/getuser', fetchuser, async (req, res) => {
    try {
      const userID = await req.user.id
      const user = await User.findById(userID).select('-password')
      res.send(user)
      io.emit('setUserSocket',req.user.id)

    } catch (error) {
      res.status(500).send(error.message)
    }
  })


  return router;
}
