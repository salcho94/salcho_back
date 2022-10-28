const express = require("express");
const compression = require("compression");
const methodOverride = require("method-override");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const HTTPS = require("https");



module.exports = function () {
  const app = express()
  const option = {
    ca: fs.readFileSync('/etc/letsencrypt/live/salcho.cf/fullchain.pem'),
    key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/salcho.cf/privkey.pem'), 'utf8').toString(),
    cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/salcho.cf/cert.pem'), 'utf8').toString(),
  };
  const server = HTTPS.createServer(option,app);
  const io = require('socket.io')(server);


  io.on('connection', socket => {
    console.log('실행중');
    socket.on('newUser',(userName) => {
      console.log(userName +'님이 접속하셨습니다.')
      socket.name = userName;
      io.emit('update',{type: 'connect', name: 'SERVER', message: userName +'님이 접속하였습니다.'});
    });

    socket.on('update',(data) =>{
      data.name = socket.name;
      io.emit('update',data);
    });

    socket.on('disconnect',() =>{
      console.log(socket.name + '님이 나가셨습니다.');
      // 나간사람을 제외한 나머지 사람들한테 메세지 전송함
      socket.broadcast.emit('update',{type:'disconnect', name:'SERVER', message: socket.name + '님이 나가셨습니다.'});
    });
  });


  /* 미들웨어 설정 */
  app.use(compression()); // HTTP 요청을 압축 및 해제
  app.use(express.json()); // body값을 파싱
  app.use(express.urlencoded({ extended: true })); // form 으로 제출되는 값 파싱
  app.use(methodOverride()); // put, delete 요청 처리
  app.use(cors()); // 웹브라우저 cors 설정을 관리
  app.use(express.static("/var/www/html/salcho_front")); // express 정적 파일 제공 (html, css, js 등..)
  app.use('/css', express.static('./static/css'))
  app.use('/js', express.static('./static/js'))
  app.use(cookieParser());// 쿠키 사용 등록
  // app.use(express.static(process.cwd() + '/public'));

  /* 직접 구현해야 하는 모듈 */
  require("../src/routes/loveRoute")(app);
  require("../src/routes/boardRoute")(app);
  require("../src/routes/memberRoute")(app);
  require("../src/routes/mainRoute")(app);

  app.get('/',(req,res) => {
    fs.readFile('./static/index.html', (err,data) => {
      if(err) {
        console.log('에러가 나왔습니다 ');
      } else {
        res.writeHead(200,{'Content-Type' : 'text/html'})
        res.write(data)
        res.end()
      }
    })
  })

  server.listen(3000, ('0.0.0.0') );

};
