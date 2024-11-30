const parser = require("@babel/parser");

const { readFileContent, allSourceTransform } = require('./utils/common.js')
const pluginList = require('./plugin/index.js')
const soureFileList = require('./source/index.js')
const bundleFileList = require('./bundle/index.js')
const parseOptions = {
  sourceType: "unambiguous",
  plugins: ['jsx'],
  sourceMapsEnabled: true
};
const sourceContentList = soureFileList.map((item) => { return readFileContent(item) })
const astTreeList = sourceContentList.map((item) => { return parser.parse(item, parseOptions) })
allSourceTransform(sourceContentList, bundleFileList, astTreeList, pluginList)
