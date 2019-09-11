const express = require('express');
const app = express();

const Router = require('./Router/router');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const mongoose = require('mongoose');
//var validateOptions={};
//connecting to mongoose database
mongoose.connect("mongodb://localhost:27017/mydb",{useNewUrlParser: true,useUnifiedTopology:true, useCreateIndex :true},function(err,db){
    if(err) console.log("not connecting");
    else console.log("connected to db");
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(expressValidator())
//registeration route
app.use('/chat_app', Router);
const port =process.env.PORT || 3000
app.listen(port,()=>{
    console.log("listening on port "+port);
});
