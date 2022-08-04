const { pool } = require("../../config/database");


exports.getList = async function (connection,pass) {
  const Query = `SELECT * FROM BOARD WHERE del_yn = 'N'`;
  const rows = await connection.query(Query);
  return rows;
};


// 게시글 작성
exports.insertBoards = async function ( connection, title, writer, content) {
  const Query = `insert into BOARD(title, writer, content) values (?,?,?)`;
  const Params = [title, writer, content];

  const rows = await connection.query(Query, Params);

  return rows;
};