const { pool } = require("../../config/database");


// 회원가입
exports.insertUsers = async function (connection, userId, password, nickname) {
  const Query = `insert into MEMBER(user_id, password, nickname,reg_date) values (?,?,?,now());`;
  const Params = [userId, password, nickname];

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