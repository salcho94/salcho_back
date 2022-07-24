module.exports = function (app) {
  const love = require("../controllers/loveController");
 
  app.post("/passCheck", love.readLove);

  app.patch("/update", love.updateLove);

};
