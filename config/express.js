const express = require("express");
const compression = require("compression");
const methodOverride = require("method-override");
const cors = require("cors");
const cookieParser = require("cookie-parser");

module.exports = function () {
  const app = express();

  /* 미들웨어 설정 */
  app.use(compression()); // HTTP 요청을 압축 및 해제
  app.use(express.json()); // body값을 파싱
  app.use(express.urlencoded({ extended: true })); // form 으로 제출되는 값 파싱
  app.use(methodOverride()); // put, delete 요청 처리
  app.use(cors()); // 웹브라우저 cors 설정을 관리
  app.use(express.static("/var/www/html/salcho_front")); // express 정적 파일 제공 (html, css, js 등..)
  app.use(cookieParser());// 쿠키 사용 등록
  // app.use(express.static(process.cwd() + '/public'));

  /* 직접 구현해야 하는 모듈 */
  require("../src/routes/loveRoute")(app);
  require("../src/routes/boardRoute")(app);
  require("../src/routes/memberRoute")(app);
  require("../src/routes/mainRoute")(app);
  require("../src/routes/mailRoute")(app);

  return app;
};
