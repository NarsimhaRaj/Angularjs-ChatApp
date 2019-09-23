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
    conversations:[{
        sender:{type:String},
        message:{type: String}
    }]
});

module.exports = mongoose.model("Chat", chatSchema);