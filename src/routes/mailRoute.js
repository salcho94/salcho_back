module.exports = function (app) {
    const mail = require("../controllers/mailController");

    //방문
    app.get("/sendmail", mail.send);


};
