const express = require("./config/express");
const { logger } = require("./config/winston"); // log

const port = 5000;
express().listen(port,'0.0.0.0');
logger.info(`API Server Start At Port ${port}`);

