process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../server');
let should = chai.should();

chai.use(chaiHttp);

//login test
describe('login /post method',function(){
    it('login should be successfull',()=>{
        let user={
            email:"raju.nani768@gmail.com",
            password:"password"
        }
        chai.request(app)
        .post('/chat_app/login')
        .send(user)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('data');
            res.body.should.have.property('message');
        done();
      });
    });
    it('login Unsuccessful 404 error',()=>{
        let user={
            email:"aju.nani768@gmail.com",
            password:"pssword"
        }
        chai.request(app)
        .post('/chat_app/login')
        .send(user)
        .end((err, res) => {
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.should.have.property('status').eql(false);
        done();
      });
    });
    it('login validation error 422 error ',()=>{
        let user={
            email:"aju.nani768gmailcom",
            password:"pssw"
        }
        chai.request(app)
        .post('/chat_app/login')
        .send(user)
        .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('error');
            res.body.should.have.property('status').eql(false);
        done();
      });
    });
});

//register test

describe('register /post method',function(){
    it('should return registered successfully',()=>{
        let user={
            username:"rajinikanth",
            firstname:"rajinikanth",
            lastname:"superstar",
            email:"superstarrajini@gmail.com",
            password:'password',
            confirmPassword:'password'
        }
        chai.request(app)
        .post('/chat_app/register')
        .send(user)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('data');
            res.body.should.have.property('message');
            res.body.should.have.property('status').eql(true);
        done();
      });
    });
    it('should return validation error with status code 422',()=>{
        let user={
            username:"rajinikanth",
            firstname:"rajinikanth",
            lastname:"superstar",
            email:"superstarrajinigmailcom",
            password:'password',
            confirmPassword:'password'
        }
        chai.request(app)
        .post('/chat_app/register')
        .send(user)
        .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('error');
            res.body.should.have.property('message');
            res.body.should.have.property('status').eql(false);
        done();
      });
    });
});

//forgotPassword
describe('forgot Password /post Method',()=>{
    it('should return mail successfully sent',()=>{
        let user={
            email: "raju.nani768@gmail.com"
        }
        chai.request(app)
        .post('/chat_app/forgotPassword')
        .send(user)
        .end((err,res)=>{
            res.should.have.status(200);
            res.body.should.have.property('message').eql("reset Password link has sent to your registeredMail");
            res.body.should.have.property('data');
            done();
        })
    });
    it('should return error with status code 404 no data found',()=>{
        let user={
            email: "raju.nani7ffff68@gmfffail.ffcom"
        }
        chai.request(app)
        .post('/chat_app/forgotPassword')
        .send(user)
        .end((err,res)=>{
            res.should.have.status(404);
            res.body.should.have.property('error')
            res.body.should.have.property(status).eql(false);
            done();
        })
    });
});