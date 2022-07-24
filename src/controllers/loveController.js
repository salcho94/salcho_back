const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");

const secret = require("../../config/secret");
const loveDao = require("../dao/loveDao");

//post 요청 !!
exports.readLove = async function(req,res){
    try{
    const { pass } = req.body;
      if (!pass) {
        return res.send({
         isSuccess: false,
         code: 400, // 요청 실패시 400번대 코드
         message: "비밀번호 값이 존재하지 않습니다.",
        });
    }
      console.log(pass);
    const connection = await pool.getConnection(async(conn) => conn);
    try{
      const [rows] = await loveDao.selectData(connection,pass);
      console.log(rows);
      if(rows.length === 0){
        return res.send({
          isSuccess: false,
          code: 400, // 요청 실패시 400번대 코드
          message: "비밀번호가 다릅니다.",
        });
      }
      return res.send({
        result: rows,
        isSuccess: true,
        code: 200,
        message: "요청 성공",
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
  const { title , coment , hidden } = req.body;
  if (title && typeof title !== "string") {
    return res.send({
      isSuccess: false,
      code: 400, // 요청 실패시 400번대 코드
      message: "값을 정확히 입력해주세요.",
    });
  }
  if (coment && typeof coment !== "string") {
    return res.send({
      isSuccess: false,
      code: 400, // 요청 실패시 400번대 코드
      message: "값을 정확히 입력해주세요.",
    });
  }
  if (hidden && typeof hidden !== "string") {
    return res.send({
      isSuccess: false,
      code: 400, // 요청 실패시 400번대 코드
      message: "값을 정확히 입력해주세요.",
    });
  }

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const [rows] = await loveDao.updateLove(
        connection,
        title,
        coment,
        hidden
      );
      return res.send({
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "수정 성공",
      });
    } catch (err) {
      logger.error(`updateLove Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`updateLove DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};

