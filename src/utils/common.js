const fs = require("fs");
const { transformFromAstSync } = require('@babel/core')
function readFileContent(fileName) {
  return fs.readFileSync(fileName, "utf8");
}
function writeFileContent(fileName, content) {
  fs.writeFileSync(fileName, content, "utf8");
}
function allSourceTransform(sourceList, bundleList, astList, pluginList) {
  sourceList.forEach((sourceItem, index) => {
    const { code } = transformFromAstSync(astList[index], sourceItem, {
      plugins: [
        [
          pluginList[index].plugin, pluginList[index].options
        ]
      ],
    })
    writeFileContent(bundleList[index], code)
  })
}
module.exports = {
  readFileContent,
  writeFileContent,
  allSourceTransform
}


