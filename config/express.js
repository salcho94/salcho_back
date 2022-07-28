const express = require("express");
//const compression = require("compression");
const methodOverride = require("method-override");
const fs = require('fs');
const path = require('path');
const HTTPS = require('https');
let cors = require("cors");

module.exports = function () {
  const app = express();

  try {
    const option = {
      ca: fs.readFileSync('/etc/letsencrypt/live/salcho.cf/fullchain.pem'),
      key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/salcho.cf/privkey.pem'), 'utf8').toString(),
      cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/salcho.cf/cert.pem'), 'utf8').toString(),
    };

    HTTPS.createServer(option, app).listen( () => {
      app.use(express.json()); // body값을 파싱
      app.use(express.urlencoded({ extended: true })); // form 으로 제출되는 값 파싱
      app.use(methodOverride()); // put, delete 요청 처리
      app.use(cors()); // 웹브라우저 cors 설정을 관리
      app.use(express.static("/var/www/html/salcho_front")); // express 정적 파일 제공 (html, css, js 등..)
    });
  } catch (error) {
    console.error('[HTTPS] HTTPS 오류가 발생하였습니다. HTTPS 서버는 실행되지 않습니다.');
    console.warn(error);
  }

  /* 미들웨어 설정 */
  //app.use(compression()); // HTTP 요청을 압축 및 해제

  // app.use(express.static(process.cwd() + '/public'));

  /* 직접 구현해야 하는 모듈 */
  require("../src/routes/loveRoute")(app);

  return app;
};
