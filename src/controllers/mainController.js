const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");
const requestIp = require('request-ip');
const request = require('request');
const secret = require("../../config/secret");
const mainDao = require("../dao/mainDao");

function doRequest(ip) {
  return new Promise(function (resolve, reject) {
    request(`http://ip-api.com/json/${ip}`, function (error, response) {
      if (!error && response.statusCode == 200) {
        resolve(response);
      } else {
        reject(error);
      }
    });
  });
}


exports.visit = async function(req,res){
  try {
    let request = require("request");

    console.log("client IP: " + requestIp.getClientIp(req));
    const ip = requestIp.getClientIp(req);

    const connection = await pool.getConnection(async (conn) => conn);
    if (!ip) {
      return res.send({
        isSuccess: false,
        code: 400, // 요청 실패시 400번대 코드
        message: "ip 가 존재하지 않습니다.",
      });
    }
      try {
        const [row] = await mainDao.getVisit(connection, ip);
        let resIp = [];
        let area = [];
        console.log(ip);
        if (row.length === 0) {
          resIp.push(ip);
          await mainDao.insertVisit(connection, ip)
        }

         let response = await doRequest(ip);
         let str = JSON.parse(response.body);
         area.push(str.country);
        area.push(str.regionName);
        area.push(str.city);
        const [today] = await mainDao.today(connection);
        const [total] = await mainDao.total(connection);

      return res.send({
        result: {today:today[0].todayCount,total:total[0].totalCount,ip: resIp[0],area: area},
        isSuccess: true,
        code: 200,
        message: "요청 성공",
        });
      } catch (err) {
        logger.error(`VISIT Query error\n: ${JSON.stringify(err)}`);
        return false;
      } finally {
        connection.release();
      }
    }
  catch
    (err)
    {
      logger.error(`VISIT DB Connection error\n: ${JSON.stringify(err)}`);
      return false;
    }
}
