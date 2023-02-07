const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const sanitizeHtml = require("sanitize-html");
const template = require("../lib/template.js");

module.exports = function (passport) {
  router.get("/login", function (request, response) {
    const fmsg = request.flash();
    let feedback = "";
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }

    const title = "WEB - login";
    const list = template.list(request.list);
    const html = template.HTML(
      title,
      list,
      `
        <div style="color:red;">${feedback}</div>
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

  router.post(
    "/login_process",
    passport.authenticate("local", {
      successRedirect: "/", // 성공시 / 로 이동
      failureRedirect: "/auth/login", // 실패시 /auth/login으로 이동
      failureFlash: true,
      successFlash: true,
    })
  );
  // local : id, pw로 로그인하는것

  router.get("/logout", function (request, response) {
    request.logout(() => {
      request.session.destroy(function (err) {
        response.redirect("/");
      });
    });
  });

  return router;
};
