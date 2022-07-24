const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");

const secret = require("../../config/secret");
const loveDao = require("../dao/loveDao");

//get 요청 !!
exports.readLove = async function(req,res){
    try{
    const connection = await pool.getConnection(async(conn) => conn);
    try{
      const [rows] = await loveDao.selectMessage(connection);
      let message = rows[0].coment; 
      return res.send({
        지섭님이메세지를보냈습니다 : message,
        
      });
    }catch (err) {
      logger.error(`LOVE Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`LOVE DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

//수정 요청 !!
exports.updateLove = async function (req, res) {
  const { coment , hidden } = req.body;
  console.log(coment,hidden);

  if (coment && typeof studentName !== "string") {
    return res.send({
      isSuccess: false,
      code: 400, // 요청 실패시 400번대 코드
      message: "값을 정확히 입력해주세요.",
    });
  }
  if (hidden && typeof major !== "string") {
    return res.send({
      isSuccess: false,
      code: 400, // 요청 실패시 400번대 코드
      message: "값을 정확히 입력해주세요.",
    });
  }

  try {
    //const connection = await pool.getConnection(async (conn) => conn);
    try {
      
      const [rows] = await loveDao.updateLove(
        connection,
        coment,
        hidden
      );
      return res.send({
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "수정 성공",
      });
    } catch (err) {
      logger.error(`updateStudent Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`updateStudent DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};

