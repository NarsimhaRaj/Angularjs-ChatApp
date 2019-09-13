const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    username :{
        type : String,
        unique : true
    },
    firstname : {
        type : String,
        min : 3,
        required :true
    },
    lastname : {
        type : String,
        min : 3,
        required :true
    },
    email : {
        type : String,
        required :true,
        unique : true
        
    },
    password : {
        type : String,
        min : 8,
        required : true
    },
    timestamp :{
        type : Date
    }
});

module.exports=mongoose.model("User",userSchema);