const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");

function templateHTML(title, list, body, control) {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}

function templateList(filelist) {
  let list = "<ul>";
  let i = 0;
  while (i < filelist.length) {
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</li>`;
    i++;
  }
  list = list + "</ul>";
  return list;
}

let app = http.createServer(function (request, response) {
  let _url = request.url;
  let queryData = url.parse(_url, true).query;
  let pathname = url.parse(_url, true).pathname;
  let title = queryData.id;

  if (pathname == "/") {
    if (queryData.id === undefined) {
      fs.readdir("../data", (err, filelist) => {
        title = "Home";

        var description = "Hell,. node.js";
        var list = templateList(filelist);
        var template = templateHTML(
          title,
          list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir("../data", (err, filelist) => {
        var list = templateList(filelist);
        fs.readFile(
          `../data/${queryData.id}`,
          "utf8",
          function (err, description) {
            var template = templateHTML(
              title,
              list,
              `<h2>${title}</h2>${description}`,
              `<a href="/create">create</a> 
              <a href="/update?id=${title}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" name="id" value="delete">
              </form>`
            );
            response.writeHead(200);
            response.end(template);
          }
        );
      });
    }
  } else if (pathname == "/create") {
    fs.readdir("../data", (err, filelist) => {
      title = "WEB - create";
      var list = templateList(filelist);
      var template = templateHTML(
        title,
        list,
        `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title" /></p>
          <p>
            <textarea name="description" id="" cols="30" rows="10" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit" name="" id="" />
          </p>
        </form>
        `,
        ""
      );
      response.writeHead(200);
      response.end(template);
    });
  } else if (pathname == "/create_process") {
    let body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      let post = qs.parse(body);
      let title = post.title;
      let description = post.description;
      fs.writeFile(`../data/${title}`, description, "utf8", (err) => {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end("success");
      });
    });
  } else if (pathname === "/update") {
    fs.readdir("../data", (err, filelist) => {
      var list = templateList(filelist);
      fs.readFile(
        `../data/${queryData.id}`,
        "utf8",
        function (err, description) {
          var template = templateHTML(
            title,
            list,
            `
            <form action="/update_process" method="post">
            <input type="hidden" name="id" values="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"/></p>
            <p>
              <textarea name="description" id="" cols="30" rows="10" placeholder="description">
              ${description}
              </textarea>
            </p>
            <p>
              <input type="submit" name="" id="" />
            </p>
           </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
          );
          response.writeHead(200);
          response.end(template);
        }
      );
    });
  } else if (pathname === "/update_process") {
    let body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      let post = qs.parse(body);
      let id = post.id;
      let title = post.title;
      let description = post.description;
      fs.rename(`../data/${id[0]}`, `../data/${title}`, (err) => {
        fs.writeFile(`../data/${title}`, description, "utf8", (err) => {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end();
        });
      });
    });
  } else if (pathname === "/delete_process") {
    let body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      let post = qs.parse(body);
      let id = post.id;
      console.log(id[0]);
      console.log(id);
      fs.unlink(`../data/${id[0]}`, (err) => {
        response.writeHead(302, { Location: `/` });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end();
  }
});
app.listen(3000);
