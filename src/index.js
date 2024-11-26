const path = require("path");
const parser = require("@babel/parser");
const { transformFromAstSync } = require('@babel/core')
const { readFileContent,writeFileContent} = require('./utils/common.js')
const trackerPlugin = require('./plugin/tracker.js')
const i18nPlugin = require('./plugin/i18n.js')
const soureFileList = [
  path.join(__dirname,'./source/track.js'),
  path.join(__dirname,'./source/i18n.js')
]
const bundleFileList = [
  path.join(__dirname,"./bundle/track.js"),
  path.join(__dirname,'./bundle/i18n.js')
]
const parseOptions = {
  sourceType: "unambiguous",
  plugins: ['jsx'],
  sourceMapsEnabled: true
};
const sourceTracker = readFileContent( soureFileList[0] )
const sourceI18n = readFileContent( soureFileList[1])
const astTracker = parser.parse( sourceTracker,parseOptions);
const astI18n = parser.parse( sourceI18n,parseOptions)

const {code} = transformFromAstSync(astI18n,sourceI18n,{
  plugins: [ 
    [
      i18nPlugin,{

      }
    ]
  ],
})
writeFileContent(bundleFileList[0],code)


