module.exports = function (app) {
  const member = require("../controllers/memberController");
  const jwtMiddleware = require("../../config/jwtMiddleware");
  // 회원가입
  app.post("/member/sign-up", member.createUsers);

  // 로그인
  app.post("/member/sign-in", member.create);

  // 로그인 유지, 토큰 검증
  app.get("/member/jwt", jwtMiddleware, member.readJwt);
};
