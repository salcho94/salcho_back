const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");

const secret = require("../../config/secret");
const boardDao = require("../dao/boardDao");

//post 요청 !!
exports.save = async  function(req,res){
    const { title, writer ,content ,boardId} = req.body;

    if(!title || !writer || !content){

        return res.send({
            isSuccess: false,
            code: 400,
            message: '게시글 정보 누락',
        })
    }
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        try{
            if(!boardId){
                const [row] = await boardDao.insertBoards(
                    connection,
                    title,
                    writer,
                    content
                );
                return res.send({
                    result: row,
                    isSuccess: true,
                    code: 200, // 요청 실패시 400번대 코드
                    message: "글 작성이 완료 되었습니다.",
                });
            }
            if(boardId){

            }

        } catch (err) {
            logger.error(`boardSave Query error\n: ${JSON.stringify(err)}`);
            return false;
        } finally {
            connection.release();
        }
    } catch (err) {
        logger.error(`boardSave DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
}

exports.list = async function(req,res){
    try{
    const connection = await pool.getConnection(async(conn) => conn);
    try{
      const [rows] = await boardDao.getList(connection);
      if(rows.length === 0){
        return res.send({
          isSuccess: false,
          code: 400, // 요청 실패시 400번대 코드
          message: "fail",
        });
      }
      return res.send({
        result: rows,
        isSuccess: true,
        code: 200,
        message: "요청 성공",
      });
    }catch (err) {
      logger.error(`Board Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`Board DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}


