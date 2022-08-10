const board = require("../controllers/boardController");


module.exports = function (app) {
  const board = require("../controllers/boardController");
  //게시글 목록
  app.get("/board/list", board.list);
  //게시글 상세
  app.get("/board/view", board.view);
  //게시글 등록
  app.post("/board/insert",board.save);
};
