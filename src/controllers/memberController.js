const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const secret = require("../../config/secret");
const memberDao = require("../dao/memberDao");
// 회원가입
exports.createUsers = async function (req, res) {
  const { userId, plainPassword, nickname } = req.body;

  // 1. 유저 데이터 검증
  const userIDRegExp = /^[a-z]+[a-z0-9]{5,19}$/; // 아이디 정규식 영문자로 시작하는 영문자 또는 숫자 6-20
  const passwordRegExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{5,15}$/; // 비밀번호 정규식 5~15 문자, 숫자 조합
  const nicknameRegExp = /^[가-힣|a-z|A-Z|0-9|]{2,10}$/; // 닉네임 정규식 2-10 한글, 숫자 또는 영문

  if (!userIDRegExp.test(userId)) {
    return res.send({
      isSuccess: false,
      code: 400, // 요청 실패시 400번대 코드
      message: "아이디 정규식 영문자로 시작하는 영문자 또는 숫자 6-20",
    });
  }

  if (!passwordRegExp.test(plainPassword)) {
    return res.send({
      isSuccess: false,
      code: 400, // 요청 실패시 400번대 코드
      message: "비밀번호 정규식 5~15 문자, 숫자 조합",
    });
  }

  if (!nicknameRegExp.test(nickname)) {
    return res.send({
      isSuccess: false,
      code: 400, // 요청 실패시 400번대 코드
      message: "닉네임 정규식 2-10 한글, 숫자 또는 영문",
    });
  }

  try {
    const createSalt = () =>
      new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
          if (err) reject(err);
          resolve(buf.toString('base64'));
        });
    });
    const HashedPassword = (plainPassword) =>
      new Promise(async (resolve, reject) => {
        const salt = await createSalt();
        crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
          if (err) reject(err);
          resolve({ password: key.toString('base64'), salt });
        });
      });
    const { password, salt } = await HashedPassword(plainPassword);

    const connection = await pool.getConnection(async (conn) => conn);
    //아이디 중복 검사.
    const row =  await memberDao.duplicationId( connection,
        userId
    );
    if(row[0][0].count){
      return res.send({
        isSuccess: false,
        code: 400, // 요청 실패시 400번대 코드
        message: "아이디가 중복됩니다. 다른 아이디를 입력해 주세요",
      });
    }
    try {
      // 2. DB 입력
      const [rows] = await memberDao.insertUsers(
          connection,
          userId,
          password,
          nickname,
          salt
      );

      // 입력된 유저 인덱스
      const userIdx = rows.insertId;

      // 3. JWT 발급
      const token = jwt.sign(
          { userIdx: userIdx, nickname: nickname }, // payload 정의
          secret.jwtsecret // 서버 비밀키
      );

      return res.send({
        result: { jwt: token },
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "동료가 된걸 환영합니다!",
      });
    } catch (err) {
      logger.error(`createUsers Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`createUsers DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};


// 로그인
exports.create = async function (req, res) {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.send({
      isSuccess: false,
      code: 400, // 요청 실패시 400번대 코드
      message: "회원정보를 입력해주세요.",
    });
  }

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const makePasswordHashed = (userId, password) =>
          new Promise(async (resolve, reject) => {
            // salt를 가져오는 부분은 각자의 DB에 따라 수정
            const [salt] = await memberDao.findSalt(connection,userId);
            crypto.pbkdf2(password, salt[0].salt, 9999, 64, 'sha512', (err, key) => {
              if (err) reject(err);
              resolve(key.toString('base64'));
            });
          });
      const  afterPassword  = await makePasswordHashed(userId,password);

       //2. DB 회원 검증
      const [rows] = await memberDao.isValidUsers(connection, userId, afterPassword);

      if (rows.length < 1) {
        return res.send({
          isSuccess: false,
          code: 410, // 요청 실패시 400번대 코드
          message: "회원정보가 존재하지 않습니다.",
        });
      }

     const { user_idx, nickname } = rows[0];

      // 3. JWT 발급
      const token = jwt.sign(
          { userIdx: user_idx, nickname: nickname }, // payload 정의
          secret.jwtsecret // 서버 비밀키
      );

   return res.send({
        result: { jwt: token },
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "로그인 성공",
      });
    } catch (err) {
      logger.error(`createJwt Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`createJwt DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};

// 로그인 유지, 토큰 검증
exports.readJwt = async function (req, res) {
  const { userIdx, nickname } = req.verifiedToken;
  return res.send({
    result: { userIdx: userIdx, nickname: nickname },
    code: 200, // 요청 실패시 400번대 코드
    message: "유효한 토큰입니다.",
  });
};