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
        required :true
        
    }
});

module.exports=mongoose.model("User",userSchema);