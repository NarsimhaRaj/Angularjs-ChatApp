process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../server');
// let should = chai.should();

chai.use(chaiHttp);

//login test with should
describe('login /post method, with should interface',function(){
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
      });
    });
});


var responseSuccessSchema={
    type:"object",
    required:['data','message','status'],
    properties:{
        data:{
            type:String
        },
        message:{
            type:String
        },
        status:{
            type:Boolean
        }
    }
}
var responseErrorSchema={
    type:"object",
    required:['error','status'],
    properties:{
        error:{
            type:String
        },
        status:{
            type:Boolean
        }
    }
}
//login test with expect
describe('login /post method,with expect interface',function(){
    it('login expects to be successfull',()=>{
        var user={
            email:"raju.nani768@gmail.com",
            password:"password"
        }
        
        chai.request(app)
        .post('/chat_app/login')
        .send(user)
        .end((err, res) => {
            expect(res).to.be.jsonShema(responseSuccessSchema);
            
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
            err(res).to.be.jsonShema(responseErrorSchema);
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
            expect(res).to.be.jsonShema(responseErrorSchema);
      });
    });
    
});


//register test, with should interface

describe('register /post method, with should interface',function(){
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
      });
    });
});

//register test, with expect interface

describe('register /post method, with expect interface',function(){
    it('should return duplicate key error',()=>{
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
            expect(res).to.not.be.jsonShema(responseSuccessSchema);
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
            expect(res).to.be.jsonShema(responseErrorSchema);
      });
    });
});

//forgotPassword, with should interface
describe('forgot Password /post Method,with should interface',()=>{
    // it('should return mail successfully sent',()=>{
    //     let user={
    //         email: "raju.nani768@gmail.com"
    //     }
    //     chai.request(app)
    //     .post('/chat_app/forgotPassword')
    //     .send(user)
    //     .end((err,res)=>{
    //         res.should.have.status(200);
    //         res.body.should.have.property('message').eql("reset Password link has sent to your registeredMail");
    //         res.body.should.have.property('data');
    //         done();
    //     })
    // });
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
        })
    });
});

//forgotPassword, with expect interface
describe('forgot Password /post Method, with expect interface',()=>{
    // it('should return mail successfully sent',()=>{
    //     let user={
    //         email: "raju.nani768@gmail.com"
    //     }
    //     chai.request(app)
    //     .post('/chat_app/forgotPassword')
    //     .send(user)
    //     .end((err,res)=>{
    //         console.log(res.body)
    //         expect(res).to.be.jsonShema(responseSuccessSchema);
    //         setTimeOut(done(),20000);
    //     });
    // });
    it('should return error with status code 404 no data found',()=>{
        let user={
            email: "raju.nani7ffff68@gmfffail.ffcom"
        }
        chai.request(app)
        .post('/chat_app/forgotPassword')
        .send(user)
        .end((err,res)=>{
            console.log(res.body)
            expect(res).to.be.jsonShema(responseErrorSchema);
        })
    });
});

//reset password with should interface
describe('reset Password /post Method',()=>{
    it('should return error saying invalid link, status code 404',()=>{
        let pass={
            password:"",
            confirmPassword:""
        }
        chai.request(app)
        .post('/chat_app/resetPassword')
        .send(pass)
        .end((err,res)=>{
            res.should.have.status(404);
            res.body.should.have.property('status').eql(false);
        })
    });
});

//reset password with expect interface
describe('reset Password /post Method',()=>{
    it('should return error saying invalid link, status code 404',()=>{
        let pass={
            password:"",
            confirmPassword:""
        }
        chai.request(app)
        .post('/chat_app/resetPassword')
        .send(pass)
        .end((err,res)=>{
            expect(res).to.be.jsonShema(responseErrorSchema);
        })
    });
});