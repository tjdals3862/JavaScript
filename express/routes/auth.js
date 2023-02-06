const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
var sanitizeHtml = require("sanitize-html");
const template = require("../lib/template.js");

var authData = {
  email: "test@gmail.com",
  password: "1234",
  nickname: "test",
};

router.get("/login", function (request, response) {
  var title = "WEB - login";
  var list = template.list(request.list);
  var html = template.HTML(
    title,
    list,
    `
      <form action="/auth/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="pwd" placeholder="password"></p>
        <p>
          <input type="submit" value="login">
        </p>
      </form>
    `,
    ""
  );
  response.send(html);
});

router.post("/login_process", function (request, response) {
  var post = request.body;
  let email = post.email;
  let password = post.pwd;
  if (email === authData.email && password === authData.password) {
    request.session.is_logined = true;
    request.session.nickname = authData.nickname;
    request.session.save(function () {
      response.redirect(`/`);
    });
  } else {
    response.send("who?");
  }
  //response.redirect(`/topic/${title}`);
});

router.get("/logout", function (request, response) {
  request.session.destroy(function (err) {
    response.redirect("/");
  });
});
module.exports = router;
