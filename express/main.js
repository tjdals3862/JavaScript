const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const compression = require("compression");

const helmet = require("helmet");
app.use(helmet());
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("connect-flash");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extends: false }));
app.use(compression());
app.use(
  session({
    secret: "asadlfkj!@#!@#dfgasdg",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);
app.use(flash());
app.get("/flash", function (req, res) {
  req.flash("msg", "Flash is back!!");
  res.send("flash");
});

app.get("/flash-display", function (req, res) {
  const fmsg = req.flash();
  res.send(fmsg);
});

let passport = require("./lib/passport.js")(app);

app.get("*", function (request, response, next) {
  fs.readdir("./data", function (error, filelist) {
    request.list = filelist;
    next();
  });
});

const topicRouter = require("./routes/topic");
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth")(passport);

app.use("/", indexRouter);
app.use("/topic", topicRouter);
app.use("/auth", authRouter);

app.use(function (req, res, next) {
  res.status(404).send("Sorry cant find that!");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(3000, () => console.log("Example app listening on port 3000"));
