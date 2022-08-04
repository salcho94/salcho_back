module.exports = function (app) {
  const board = require("../controllers/boardController");
 
  app.get("/board/list", board.list);

  app.post("/board/insert",board.save);
};
