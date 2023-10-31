const fetchuser = require('../middleware/fetchuser');
const Chat = require('../models/Chat')
const ChatID = require('../models/ChatID');
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');


module.exports = (io,userToSocketMap)=>{
// Create a new chat
router.post('/chats', fetchuser, async (req, res) => {
  try {
    const { participants, messages } = req.body;
    const newChat = new Chat({ participants, messages });
    const savedChat = await newChat.save();
    const chatID = savedChat._id
    const nayaChat = {
      chatid: chatID,
      participants: participants
    } // Participants[0] is the user
    const foundChatID1 = await ChatID.findOne({ userID: participants[0] })
    const foundChatID2 = await ChatID.findOne({ userID: participants[1] })
    foundChatID1.chatID.push(nayaChat)
    foundChatID2.chatID.push(nayaChat)

    await foundChatID1.save();
    await foundChatID2.save();

    res.status(201).json({ savedChat, chatID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all chats
router.get('/getchats/:chatId', fetchuser, async (req, res) => {
  try {
    const chatId = req.params.chatId;

    // Find the chat by ID
    const chats = await Chat.findById(chatId);
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve chats' });
  }
});

// Send a message in a chat
router.post('/chats/:chatId/messages', [
  body('content', 'Message is too short!').matches(/\S/).isString().isLength({ min: 1 }),
  body('sender', 'Sender cannot be found').not().isEmpty()
], async (req, res) => {
  try {
    const error = validationResult(req)
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    const { content, sender } = req.body;
    const chatId = req.params.chatId;

    // Find the chat by ID
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Create a new message 
    const newMessage = { content, sender };
    chat.messages.push(newMessage);

    // Save the updated chat
    await chat.save();

    const participantsArray = Object.values(chat.participants);
    if(userToSocketMap[participantsArray[0].toString()]!==null){
      io.to(userToSocketMap[participantsArray[0].toString()]).emit('message',newMessage);
    }
    if(userToSocketMap[participantsArray[1].toString()]!==null){
      io.to(userToSocketMap[participantsArray[1].toString()]).emit('message',newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Find chat by user ID
router.post('/findchatid', fetchuser, async (req, res) => {
  try {
    const { userId } = req.body;
    let chatID = await ChatID.findOne({ userID: userId })
    if (chatID === null) {
      return res.status(500).json({ error: "Not found" })
    }
    res.status(200).json(chatID)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  return router
}