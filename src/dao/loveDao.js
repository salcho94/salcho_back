const { pool } = require("../../config/database");


exports.selectMessage = async function (connection) {
  const Query = `SELECT * FROM LOVE;`;
  const rows = await connection.query(Query);

  return rows;
};

exports.updateLove = async function (
  connection,
  coment,
  hidden
) {
  const Query = `update LOVE set coment = ifnull(?, coment), hidden = ifnull(?, hidden)`;
  const Params = [coment, hidden];

  const rows = await connection.query(Query, Params);

  return rows;
};
