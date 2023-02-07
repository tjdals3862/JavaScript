const express = require("express");
const router = express.Router();
const template = require("../lib/template.js");
const auth = require("../lib/auth.js");

router.get("/", function (request, response) {
  const fmsg = request.flash();
  let feedback = "";
  if (fmsg.success) {
    feedback = fmsg.success[0];
  }

  var title = "Welcome";
  var description = "Hello, Node.js";
  var list = template.list(request.list);
  var html = template.HTML(
    title,
    list,

    `
    <div style="color:blue;">${feedback}</div>
    <h2>${title}</h2>${description}
    <img src="/images/hello.jpg" style="width:300px; display:block; margin-top: 10px"></img>
    `,
    `<a href="/topic/create">create</a>`,
    auth.statusUI(request, response)
  );
  response.send(html);
});

module.exports = router;
