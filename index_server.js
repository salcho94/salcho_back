const express = require("./config/express");
const { logger } = require("./config/winston"); // log
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const app = express();
// Certificate 인증서 경로
const privateKey = fs.readFileSync('/etc/letsencrypt/live/salcho.cf/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/salcho.cf/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/salcho.cf/chain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

app.use((req, res) => {
    res.send('Hello there !');
});

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(3000, () => {
    console.log('HTTP Server running on port 80');
});

httpsServer.listen(3001, () => {
    console.log('HTTPS Server running on port 443');
});