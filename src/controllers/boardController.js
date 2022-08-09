const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");

const secret = require("../../config/secret");
const boardDao = require("../dao/boardDao");

//post 요청 !!
exports.save = async  function(req,res){
    const { title, writer ,content ,boardId ,pass } = req.body;
    let secretYn = 'N';
    if(!title || !writer || !content){

        return res.send({
            isSuccess: false,
            code: 400,
            message: '게시글 정보 누락',
        })
    }
    if(req.body.pass){
        secretYn = 'Y';
    }
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        try{
            if(!boardId){
                const [row] = await boardDao.insertBoards(
                    connection,
                    title,
                    writer,
                    content,
                    pass,
                    secretYn
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
    const {page} = req.query;
    let pageNum;
    if(page){
        console.log(page)
        console.log(Number(page) * 10)
        pageNum = (page * 10 ) - 10 ;
        console.log(pageNum)
    }else{
        pageNum = 0;
    }
    try{
        const connection = await pool.getConnection(async(conn) => conn);
        try{
          const [rows] = await boardDao.getList(connection,pageNum);
          const total = await boardDao.getTotal(connection);

          if(rows.length === 0){
            return res.send({
              isSuccess: false,
              code: 400, // 요청 실패시 400번대 코드
              message: "fail",
            });
          }
          return res.send({
            result: rows , total,
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


exports.view = async function(req,res){
    const { boardIdx ,secret ,pass} = req.query;
    if(!boardIdx ){
        return res.send({
            isSuccess: false,
            code: 400,
            message: '존재하지 않는 게시글',
        })
    }

    try{
        const connection = await pool.getConnection(async(conn) => conn);

        try{
            if(secret == 'Y'){
                const row = await boardDao.passCheck(connection, boardIdx ,pass);
                if(row.length === 0){
                    return res.send({
                        isSuccess: false,
                        code: 400, // 요청 실패시 400번대 코드
                        message: "비밀번호가 다릅니다.",
                    });
                }
                return res.send({
                    result: row,
                    isSuccess: true,
                    code: 200,
                    message: "요청 성공",
                });
            }else{
                const rows = await boardDao.secretCheck(connection, boardIdx);
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
            }

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
