const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'user', // Reference to the user who sent the message
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new Schema({
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'user', // Reference to the users participating in the chat
    required: true,
  }],
  messages: [messageSchema], // An array of message documents
});

const Chat = model('chat', chatSchema);

module.exports = Chat;
