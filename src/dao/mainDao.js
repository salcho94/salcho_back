const { pool } = require("../../config/database");



exports.getVisit = async function (connection, ip) {
  const Query = `SELECT * FROM VISIT WHERE ip = ? and visit_date = DATE_FORMAT(now(),'%Y-%m-%d')`;
  const Params = [ip];
  const rows = await connection.query(Query, Params);
  return rows;
};

exports.insertVisit = async function (connection, ip) {
  const Query = `insert into VISIT(ip, visit_date,visit_count,visit_time) values (?,DATE_FORMAT(now(),'%Y-%m-%d'),1,DATE_FORMAT(NOW(),'%Y-%m-%d:%H:%i:%S'))`;
  const Params = [ip];

  const rows = await connection.query(Query, Params);

  return rows;
};

exports.today = async function (connection) {
  const Query = `SELECT count(visit_date) as todayCount FROM VISIT WHERE visit_date = DATE_FORMAT(now(),'%Y-%m-%d')`;
  const rows = await connection.query(Query);
  return rows;
};

exports.total = async function (connection) {
  const Query = `SELECT count(visit_date) as totalCount FROM VISIT`;
  const rows = await connection.query(Query);
  return rows;
};