const nodemailer = require("nodemailer");

const sendMail = () => {
    let transporter = nodemailer.createTransport({
        /*service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,*/
        host: 'smtp.gmail.com',
        port: 465,
        secure: false,
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASS,
        },
    });

    transporter.sendMail({
        from: `"SALCHO" <${process.env.EMAIL_ID}>`,
        to: 'salcho94@naver.com',
        subject: '제목입니다',
        text: '내용입니다.',
    });
    console.log('실행됨');
}

module.exports = {
    sendMail: sendMail,
};