const express = require("./config/express");
const { logger } = require("./config/winston"); // log
const fs = require('fs');
const path = require('path');
const HTTP = require('http');
const https = require('https');
const PORT = process.env.PORT || 443;


const app = express();
const server = https.createServer(app);
try {
    const options = {
        ca: fs.readFileSync('/etc/letsencrypt/live/salcho.cf/fullchain.pem'),
        key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/salcho.cf/privkey.pem'), 'utf8').toString(),
        cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/salcho.cf/cert.pem'), 'utf8').toString(),
    };

    https.createServer(options, app).listen(PORT);

    } catch (error) {
        console.error('[HTTPS] HTTPS 오류가 발생하였습니다. HTTPS 서버는 실행되지 않습니다.');
        console.log(error);
}

