const fs = require("fs");
module.exports = {
  readFileContent (fileName) {
    return fs.readFileSync(fileName, "utf8");
  },
  writeFileContent(fileName, content) {
    fs.writeFileSync(fileName, content, "utf8");
  }
}


