const { pool } = require("../../config/database");

// 게시글 목록 불러오기
exports.getList = async function (connection,pageNum) {
  const Query = `SELECT board_idx as boardIdx , writer , title, content , insert_dt as insertDt, secret_yn as secret,  board_count as count
                 FROM BOARD
                 WHERE del_yn = 'N'
                 ORDER BY board_idx DESC
                   LIMIT ?, 10;`;
  const Params = [pageNum];
  const rows = await connection.query(Query,Params);
  return rows;
};

//관리자 게시글 목록 불러오기
exports.getAdminList = async function (connection) {
  const Query = `SELECT board_idx as boardIdx , writer , title, content , insert_dt as insertDt, secret_yn as secret,  board_count as count
                 FROM BOARD
                 WHERE del_yn = 'N'
                 ORDER BY board_idx DESC`;
      
  const rows = await connection.query(Query);
  return rows;
};

// 전체 글 갯수
exports.getTotal = async function (connection) {
  const Query = `SELECT count(*) as total FROM BOARD  WHERE del_yn ='N';`;
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


//비밀글 여부 확인
exports.secretCheck = async function ( connection, boardId) {
  const Query = `SELECT * FROM BOARD WHERE del_yn = 'N' and board_idx = ?`;
  const Params = [boardId];

  const rows = await connection.query(Query, Params);

  return rows;
};


// 비밀글 불러오기
exports.passCheck = async function ( connection, boardId, pass) {
  const Query = `SELECT * FROM BOARD WHERE del_yn = 'N' and board_idx = ? and pass = ?`;
  const Params = [boardId, pass];

  const rows = await connection.query(Query, Params);

  return rows;
};


// 조회수 증가
exports.updateCount = async function ( connection, boardId){
  const Query = `UPDATE BOARD SET board_count = board_count + 1 WHERE board_idx = ?`;
  const Param = [boardId];

  const row = await connection.query(Query,Param);

  return row;
}