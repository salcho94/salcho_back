module.exports = function (app) {
  const member = require("../controllers/memberController");
  // 회원가입
  app.post("/member/sign-up", member.createUsers);
};
