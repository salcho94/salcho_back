const board = require("../controllers/boardController");
module.exports = function (app) {
  const board = require("../controllers/boardController");
 
  app.get("/board/list", board.list);

  app.get("/board/view", board.view);

  app.post("/board/insert",board.save);
};
