require('dotenv').config();
const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");
const nodemailer = require("nodemailer");
const requestIp = require('request-ip');
const request = require('request');
const secret = require("../../config/secret");


function doRequest(ip) {
  return new Promise(function (resolve, reject) {
    request(`http://ip-api.com/json/${ip}`, function (error, response) {
      if (!error && response.statusCode == 200) {
        resolve(response);
      } else {
        reject(error);
      }
    });
  });
}


exports.send = async function(req,res){
  const {title , message} = req.query;
  const ip = requestIp.getClientIp(req);
  console.log(ip);
  // let resIp = await doRequest(ip);
  let resIp = await doRequest('122.43.55.208');
  let area = [];
  let areaStr = JSON.parse(resIp.body);
  area.push(areaStr.country);
  area.push(areaStr.regionName);
  area.push(areaStr.city);
  console.log(area);
  let transporter;
  transporter = nodemailer.createTransport({
    service: 'gmail',   // 메일 보내는 곳
    prot: 587,
    host: 'smtp.gmlail.com',
    secure: false,
    requireTLS: true,
    auth: {
      // Gmail 주소 입력, 'testmail@gmail.com'
      user: process.env.EMAIL_ID,
      // Gmail 패스워드 입력
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    console.log(area);
    let mailOptions = {
      from: 'rlaqwe@gmail.com', // 보내는 메일의 주소
      to: 'rlaqwe8@gmail.com', // 수신할 이메일
      subject: title, // 메일 제목
      html: `<p>${message}</p>
            <p>국가 : ${area[0] === undefined? '모바일 접속' : area[0]}<br>
            지역 : ${area[1] === undefined? '모바일 접속' : area[1]}<br>
            도시 : ${area[2]=== undefined? '모바일 접속' : area[2]}
            </p> `
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    return res.send({
      result: "성공",
      isSuccess: true,
      code: 200,
      message: "요청 성공",
      });
  } catch (err) {
    logger.error(`mail send error\n: ${JSON.stringify(err)}`);
    return false;
  }
}
