const parser = require("@babel/parser");
const { transformFromAstSync } = require('@babel/core')
const { readFileContent, writeFileContent } = require('./utils/common.js')
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
const optionsList = [
  { trackerPath: 'tracker' },
  {}
]
function allSourceTransform(sourceList, bundleList, astList, pluginList, optionsList) {
  sourceList.forEach((sourceItem, index) => {
    const { code } = transformFromAstSync(astList[index], sourceItem, {
      plugins: [
        [
          pluginList[index], optionsList[index]
        ]
      ],
    })
    writeFileContent(bundleList[index], code)
  })

}


allSourceTransform(sourceContentList, bundleFileList, astTreeList, pluginList, optionsList)
