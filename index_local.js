const express = require("./config/express");
const { logger } = require("./config/winston"); // log

const port = 3000;
express().listen();
logger.info(`API Server Start At Port ${port}`);

