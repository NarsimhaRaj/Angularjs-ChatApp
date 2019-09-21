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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/chat_app', Router);

const port = process.env.PORT || 5064
var server=app.listen(port,()=>{
    console.log("listening on port "+port);
});

const io=socket(server);
app.use(express.static('../Client'));
io.on('connection', function(socket){
    console.log("connected to socket")
    socket.on('disconnect', function() {
        console.log("disconnected")
        });
        socket.on('sending', function(data) { 
           UserController.chatConversation(data);
           io.sockets.in(data.receiver).emit("receiving",data.message);
        });
    // connection.push(socket);
    // console.log('%s user connected',connection.length);
    // socket.on('disconnect',function(data){
    //     connection.splice(connection.indexOf(socket),1);
    //     console.log("1 user disconnected, connected users %s ",connection.length);
    // })
});


