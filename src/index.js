const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require('@babel/traverse').default;
const generate = require("@babel/generator").default;
const types = require('@babel/types')
const { consoleLoc,beforeConsole,newBeforeConsole } = require('./utils/consoleLoc.js');
const { sourceMapsEnabled } = require("process");
const fileName = path.join(__dirname, "./source.js");
const astFile = path.join(__dirname, "./ast.json");
const bundleFile = path.join(__dirname,"./bundle.js")

const parseOptions = {
  sourceType: "unambiguous",
  plugins: ['jsx'],
  sourceMapsEnabled: true
};
function readFileContent(fileName) {
  return fs.readFileSync(fileName, "utf8");
}

function writeFileContent(fileName, content) {
  fs.writeFileSync(fileName, content, "utf8");
}


const ast = parser.parse(readFileContent(fileName),parseOptions);
traverse(ast,{
  CallExpression(path,state){
    //consoleLoc(path)
    //beforeConsole(path)
    newBeforeConsole(path)
  }
})


const { code } = generate(ast)


writeFileContent(astFile, JSON.stringify(ast, null, 2));
writeFileContent(bundleFile,code)

