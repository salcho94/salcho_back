module.exports = function (app) {
  const main = require("../controllers/mainController");

  //방문
  app.get("/visit", main.visit);



};
