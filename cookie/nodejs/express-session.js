const express = require("express");
//var parseurl = require("parseurl");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const app = express();

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);

app.get("/", function (req, res, next) {
  if (req.session.num === undefined) {
    req.session.num = 1;
  } else {
    req.session.num = req.session.num + 1;
  }
  res.send(res.send(`Views : ${req.session.num}`));
});

app.listen(3001);
