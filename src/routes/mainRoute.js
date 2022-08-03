module.exports = function (app) {
  const main = require("../controllers/mainController");

  //방문
  app.get("/", main.visit);



};
