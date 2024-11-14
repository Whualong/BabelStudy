const types = require('@babel/types')
const template = require('@babel/template')

module.exports = {
   consoleLoc (path) {
    const arr= ['log','info','error','warn'].map((item)=>`console.${item}`)
    const calleeName = path.get('callee').toString()
    if( arr.includes(calleeName)){
      const { line,column} = path.node.loc.start
      path.node.arguments.unshift(
        types.stringLiteral(`fileName:${line} ${column}`)
      )
    }
  },
  beforeConsole(path){
    if (path.node.isNew) {
      return;
    }
    const arr= ['log','info','error','warn'].map((item)=>`console.${item}`)
    const calleeName = path.get('callee').toString()
    if( arr.includes(calleeName)){
      const { line,column} =  path.node.loc.start
      const newNode = template.expression(`console.log("filename: (${line}, ${column})")`)();
      newNode.isNew = true
      if (path.findParent(path => path.isJSXElement())) {
        path.replaceWith(types.arrayExpression([newNode, path.node]))
        path.skip()
      }else{
        path.insertBefore( newNode )
      }
      // path.skip()
    }
  },
  newBeforeConsole(path){
    if(path.node.isNew || path.parent.isNew)
      return
    const arr= ['log','info','error','warn'].map((item)=>`console.${item}`)
    const calleeName = path.get('callee').toString()
    if( arr.includes(calleeName)){
      const { line,column} =  path.node.loc.start
      const ifJSX = path.findParent((path)=>path.isJSXElement())
      const newNode = ifJSX? types.jSXExpressionContainer(template.expression(`console.log("filename: (${line}, ${column})")`)()) : 
      template.statement(`console.log("filename: (${line}, ${column})")`)();
      newNode.isNew = true;
      if (ifJSX) {
        path.find(p => p.type === 'JSXElement').node.children.unshift(newNode);
      } else {
        path.insertBefore(newNode);
      }
    }
  }
} 