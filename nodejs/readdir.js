const testFoler = "../nodejs";
const fs = require("fs");

fs.readdir(testFoler, (err, filelist) => {
  console.log(filelist);
});
