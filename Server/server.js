/**
 * @purpose : Server Connection and respond to user request
 * @file : server.js
 * @overview : to make connection with Server  and respond to user request
 * @author : NarsimhaRaj 
 * @since : 09/09/2019
 * 
 */
const express = require('express');
const app = express();
const Router = require('./Router/router');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const mongoose = require('mongoose');
//var validateOptions={};
//connecting to mongoose database
mongoose.connect(process.env.DBCONNECTION,{useFindAndModify:false,useNewUrlParser: true,useUnifiedTopology:true, useCreateIndex :true}).catch(err=>handleError(err));
mongoose.connection.on("connected",()=>{
    console.log("Successfully connected to database");
});
mongoose.connection.on("disconnected",()=>{
    console.log("Disconnected to database");
    process.exit(1);
});
mongoose.connection.on("error",()=>{
    console.log("Error in Connecting ");
    process.exit(1);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(expressValidator())
//registeration route
app.use('/chat_app', Router);
const port =process.env.PORT || 9001
app.listen(port,()=>{
    console.log("listening on port "+port);
});
