module.exports = function (app) {
  const love = require("../controllers/loveController");

  //포뇨게시판 비밀번호
  app.post("/passCheck", love.readLove);

  //포뇨게시판 글 수정
  app.patch("/update", love.updateLove);


};
