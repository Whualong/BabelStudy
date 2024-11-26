const { declare } = require('@babel/helper-plugin-utils')
const importModule = require('@babel/helper-module-imports')
const i18nPlugin = declare( (api,opts,dirname)=>{
  return {
    pre( file ){
      file.set('allText',[])
    },
    visitor: {
      Program: {
        enter( path, state ){
          path.traverse( {
            ImportDeclaration(path){
              if(state.importedIntlId)return;
              const source = path.node.source.value 
              if(source === 'intl'){
                state.importedIntlId = 'intl';
                return
              }
            },
            StringLiteral(path){
              if(path.findParent((p)=>p.isImportDeclaration()))return;
              if(path.node.skipTransformI18n)return;
              if(path.node.leadingComments){
                path.node.leadingComments = path.node.leadingComments.filter((item)=>{
                  if(item.value.includes('i18n-disabled')){
                    path.node.skipTransformI18n = true
                    return false
                  }
                  return true
                })
              }
              
            }
          })
          if(!state.importedIntlId){
            state.importedIntlId = importModule.addDefault(path,'intl',{
              nameHint: path.scope.generateUid('intl')
            }).name
          }
        }
      }
    },
    post(){

    }
  }
})
module.exports = i18nPlugin