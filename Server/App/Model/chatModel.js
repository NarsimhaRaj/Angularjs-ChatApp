const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    sender: {
        type: String,
        required:true
    },
    receiver: {
        required:true,
        type: String
    },
    messages:[{
        type: String
    }]
});

module.exports = mongoose.model("Chat", chatSchema);