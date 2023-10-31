const express = require('express');
const User = require('../models/User');
const ChatID = require('../models/ChatID')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');


router.post('/', [
    body('username','Enter a valid username')
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_]+$/)
  ], async (req, res) => {
    try {
      const error = validationResult(req)
      if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
      }
  
      const {username } = req.body;
  
      // Find the username
      const foundusername = await User.findOne({username: username});
  
      if (!foundusername) {
        return res.status(404).json({ error: 'User not found' });
      }

  
      res.status(201).json({
        name: foundusername.name,
        username: foundusername.username,
        userID : foundusername._id
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.post('/chatsearch',fetchuser, async (req, res) => {
    try {

      const {username} = req.body;
      const userID = req.user.id; //UserID
      const foundusername = await User.findOne({username: username})
      // searchedUserID
      const searchedUserID = foundusername._id
      const userChat = await ChatID.findOne({userID: userID})
      let verificationCount = 0;
      let chatIDFound = null
      const chatArray = Object.values(userChat.chatID);
      chatArray.forEach( chat => {
        if (
          chat.participants.includes(userID) &&
          chat.participants.includes(searchedUserID)
        ) {
          verificationCount++;
          chatIDFound = chat.chatid;
        }
      });
      if(verificationCount==1){
        return res.status(201).json({
          chatID: chatIDFound
        });
      }
      res.json({
        chatID: chatIDFound
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  module.exports = router;