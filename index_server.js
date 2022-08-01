const express = require("./config/express");
const { logger } = require("./config/winston"); // log
const fs = require('fs');
const path = require('path');
const http = require("http")
const https = require('https');


const port = 3000;
try {
    const option = {
        ca: fs.readFileSync('/etc/letsencrypt/live/salcho.cf/fullchain.pem'),
        key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/salcho.cf/privkey.pem'), 'utf8').toString(),
        cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/salcho.cf/cert.pem'), 'utf8').toString(),
    };
    const app = express();
    http.createServer(app).listen(80)
    https.createServer(option, app).listen(443, () => {
        console.log(`[HTTPS] Soda Server is started on port ${console.log(port)}`);
    });
} catch (error) {
    console.error('[HTTPS] HTTPS 오류가 발생하였습니다. HTTPS 서버는 실행되지 않습니다.');
    console.log(error);
}

logger.info(`API Server Start At Port ${port}`);
