const { pool } = require("../../config/database");


exports.getList = async function (connection,pass) {
  const Query = `SELECT board_idx as boardIdx , writer , title, content , insert_dt as insertDt, secret_yn as secret,  board_count as count FROM BOARD WHERE del_yn = 'N'`;
  const rows = await connection.query(Query);
  return rows;
};


// 게시글 작성
exports.insertBoards = async function ( connection, title, writer, content , pass , secretYn) {
  const Query = `insert into BOARD(title, writer, content, pass , secret_yn) values (?,?,?,ifnull(?, null),?)`;
  const Params = [title, writer, content , pass , secretYn];

  const rows = await connection.query(Query, Params);

  return rows;
};

exports.secretCheck = async function ( connection, boardId) {
  const Query = `SELECT * FROM BOARD WHERE del_yn = 'N' and board_idx = ?`;
  const Params = [boardId];

  const rows = await connection.query(Query, Params);

  return rows;
};


exports.passCheck = async function ( connection, boardId, pass) {
  const Query = `SELECT * FROM BOARD WHERE del_yn = 'N' and board_idx = ? and pass = ?`;
  const Params = [boardId, pass];

  const rows = await connection.query(Query, Params);

  return rows;
};