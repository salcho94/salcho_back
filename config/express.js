const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require("express");
const compression = require("compression");
const methodOverride = require("method-override");
var cors = require("cors");

module.exports = function () {
  const app = express();
  // Certificate 인증서 경로
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/salcho.cf/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/salcho.cf/cert.pem', 'utf8');
  const ca = fs.readFileSync('/etc/letsencrypt/live/salcho.cf/chain.pem', 'utf8');

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };

  app.use((req, res) => {
    res.send('Hello there !');
  });

// Starting both http & https servers
  const httpServer = http.createServer(app);
  const httpsServer = https.createServer(credentials, app);

  httpServer.listen(3000, () => {
    console.log('HTTP Server running on port 80');
  });

  httpsServer.listen(3000, () => {
    console.log('HTTPS Server running on port 443');
  });
  /* 미들웨어 설정 */
  app.use(compression()); // HTTP 요청을 압축 및 해제
  app.use(express.json()); // body값을 파싱
  app.use(express.urlencoded({ extended: true })); // form 으로 제출되는 값 파싱
  app.use(methodOverride()); // put, delete 요청 처리
  app.use(cors()); // 웹브라우저 cors 설정을 관리
  app.use(express.static("/var/www/html/salcho_front")); // express 정적 파일 제공 (html, css, js 등..)
  // app.use(express.static(process.cwd() + '/public'));

  /* 직접 구현해야 하는 모듈 */
  require("../src/routes/loveRoute")(app);

  return app;
};
