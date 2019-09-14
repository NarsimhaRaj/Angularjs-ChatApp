const nodemailer=require('nodemailer');
require('dotenv').config();

exports.sendMail=(body,tkn,callback)=>{
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', port: 465,
        secure: true, 
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.PASSWORD // generated ethereal password
        },
        tls: { rejectUnauthorized: false }
    });
    var message = {
        from: process.env.EMAIL,
        to: body.email,
        subject: 'Reset Password for your Chat App', // Subject line
        text: 'Click on the following link to reset password \n' + "http://localhost:3000/resetPassword/" + "\n" + tkn, // plain text body
        html: '' // html body
    };

    transporter.sendMail(message, function (error, response) {
        if (error) callback(error);
        else callback(null,response);
    });
};