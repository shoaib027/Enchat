const { Schema, model } = require('mongoose');
const chatIDSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true
    },
    chatID: [{
        chatid: {
            type: String,
            required: true
        },
        participants: [{
            type: Schema.Types.ObjectId,
            ref: 'user', // Reference to the users participating in the chat
            required: true,
        }]

    }]
})

const ChatID = model('chatID', chatIDSchema);

module.exports = ChatID;