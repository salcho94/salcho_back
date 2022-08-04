const { pool } = require("../../config/database");


// 회원가입
exports.insertUsers = async function (connection, userId, password, nickname,salt) {
  const Query = `insert into MEMBER(user_id, password, nickname,salt,reg_date) values (?,?,?,?,now())`;
  const Params = [userId, password, nickname,salt];

  const rows = await connection.query(Query, Params);

  return rows;
};

//아이디 중복검사
exports.duplicationId = async function(connection,userId){
  const Query = `select count(*) as count from MEMBER where user_id = ?`;
  const Param = userId;

  const row = await connection.query(Query,Param);
  return row;
}

// 로그인 (회원검증)
exports.isValidUsers = async function (connection, userId, afterPassword) {
  const Query = `SELECT user_idx, nickname ,user_id FROM MEMBER where user_id = ? and password = ? and status = 'Y';`;
  const Params = [userId, afterPassword];

  const rows = await connection.query(Query, Params);

  return rows;
};


exports.findSalt = async function(connection , userId){
  const Query = `SELECT salt FROM MEMBER where user_id = ? and status = 'Y';`;
  const Params = [userId];

  const rows = await connection.query(Query, Params);

  return rows;
}