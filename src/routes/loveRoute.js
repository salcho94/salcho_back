module.exports = function (app) {
  const love = require("../controllers/loveController");
 
  app.get("/love", love.readLove);

  app.patch("/update", love.updateLove);

};
