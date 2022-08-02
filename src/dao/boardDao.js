const { pool } = require("../../config/database");


exports.getList = async function (connection,pass) {
  const Query = `SELECT * FROM test `;
  const rows = await connection.query(Query);
  return rows;
};


