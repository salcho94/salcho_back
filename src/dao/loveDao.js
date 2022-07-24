const { pool } = require("../../config/database");


exports.selectData = async function (connection,pass) {
  const Query = `SELECT * FROM LOVE where pass = ?;`;
  const param = pass
  const rows = await connection.query(Query,param);
  return rows;
};

exports.updateLove = async function (
  connection,
  title,
  coment,
  hidden
) {
  const Query = `update LOVE set title = ifnull(?, title), coment = ifnull(?, coment), hidden = ifnull(?, hidden)`;
  const Params = [title,coment, hidden];

  const rows = await connection.query(Query, Params);

  return rows;
};
