const express = require("./config/express");
const { logger } = require("./config/winston"); // log
const fs = require('fs');
const path = require('path');
const HTTPS = require('https');

const app = express();
const port = 3000;
try {
    const option = {
        ca: fs.readFileSync('/etc/letsencrypt/live/salcho.cf/fullchain.pem'),
        key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/salcho.cf/privkey.pem'), 'utf8').toString(),
        cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/salcho.cf/cert.pem'), 'utf8').toString(),
    };

    HTTPS.createServer(option, app).listen(port, () => {
        logger.info(`API Server Start At Port ${port}`);
    });
    } catch (error) {
        console.error('[HTTPS] HTTPS 오류가 발생하였습니다. HTTPS 서버는 실행되지 않습니다.');
        console.log(error);
}


