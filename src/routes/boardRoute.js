module.exports = function (app) {
  const board = require("../controllers/boardController");
 
  app.get("/board/list", board.list);

};
