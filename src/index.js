const path = require("path");
const parser = require("@babel/parser");
const { transformFromAstSync } = require('@babel/core')
const { readFileContent,writeFileContent} = require('./utils/common.js')
const trackerPlugin = require('./plugin/tracker.js')
const soureFileList = [
  path.join(__dirname,'./source/track.js')
]
const bundleFileList = [
  path.join(__dirname,"./bundle/track.js")
]
const parseOptions = {
  sourceType: "unambiguous",
  plugins: ['jsx'],
  sourceMapsEnabled: true
};
const sourceTracker = readFileContent( soureFileList[0] )
const astTracker = parser.parse( sourceTracker,parseOptions);
const {code} = transformFromAstSync(astTracker,sourceTracker,{
  plugins: [ [
    trackerPlugin,{
      trackerPath: 'tracker'
    }
  ]],
})
writeFileContent(bundleFileList[0],code)


