const fs = require("fs");

//readFileSync
/* console.log("A");
let result = fs.readFileSync("./sample.txt", "utf8");
console.log(result); 
console.log("C");
*/

//readFile
console.log("A");
fs.readFile("./sample.txt", "utf8", (err, result) => {
  console.log(result);
});
console.log("C");
