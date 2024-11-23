const { declare } = require('@babel/helper-plugin-utils')
const importModule = require('@babel/helper-module-imports')
const trackerPlugin = declare( function(api,options,dir){
  api.assertVersion(7)
  return {
    visitor:{
      Program: {
        enter(path,state){
          path.traverse({
            ImportDeclaration(path,state){
              const requiredPath = path.get('source').node.value.toString()
              if( requiredPath === options.trackerPath)
            }
          })
        } 
      }
    }
  }
})
module.exports = trackerPlugin