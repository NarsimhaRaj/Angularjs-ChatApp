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
const socket=require('socket.io');
const Router = require('./Router/router');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const UserController=require('../Server/Controller/userController');

const mongoose = require('mongoose');
require('dotenv').config();

//var validateOptions={};
//connecting to mongoose database
mongoose.connect(process.env.DBCONNECTION,{useFindAndModify:false,useNewUrlParser: true,useUnifiedTopology:true, useCreateIndex :true});

//mongoose connection events 
mongoose.connection.on("connected",()=>{
    console.log("Successfully connected to database");
});
//if disconnected 
mongoose.connection.on("disconnected",()=>{
    console.log("Disconnected to database");
    process.exit(1);
});
//if any error in connecting to mongoose database
mongoose.connection.on("error",()=>{
    console.log("Error in Connecting ");
    process.exit(1);
});

//using middleware bodyparse 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

//Express-validator is a middleware for Express on Node.js that can help you validate user input. 
app.use(expressValidator())

// // to avoid CORS errors
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use('/chat_app', Router);

const port = process.env.PORT || 5064
var server=app.listen(port,()=>{
    console.log("listening on port "+port);
});

const io=socket(server);
//loads index.html file at client side 
app.use(express.static('../Client'));

//socket connection 
io.on('connection', function(socket){
    console.log("connected to socket")
    //if socket is disconnected 
    socket.on('disconnect', function() {
        console.log("disconnected")
        });
        //when user emits a sending event takes daat and stores message in database with sender details

        socket.on("Create Private Room",function(data){
            socket.join(data.sender+" "+data.receiver)
        });

        socket.on('sending', function(data) { 
           UserController.chatConversation(data,(err,response)=>{ 
            if(response.status){
                   socket.join(response.data.sender+" "+response.data.receiver);
                   io.to(response.data.sender+" "+response.data.receiver).emit('receiving',response.data);
               }
           })
        });
});


module.exports=app;