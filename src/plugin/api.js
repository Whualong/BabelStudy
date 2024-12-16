const { declare } = require('@babel/helper-plugin-utils')
const doctrine = require('doctrine')
const fse = require('fs-extra');
const renderer = require('../utils/renderer')
const path = require('path')
function resolveType(typeNode) {
  const key = typeNode?.type
  const maps = {
    'TSStringKeyword': 'String',
    'TSNumberKeyword': 'Number',
    'TSBooleanKeyword': 'Boolean'
  }
  return maps[key] ? maps[key] : key
}
function parseComments(comments) {
  if (!comments) return;
  return doctrine.parse(comments, {
    unwrap: true
  })
}
function generate(docs, format = 'json') {
  if (format === 'markdown') {
    return {
      ext: '.md',
      content: renderer.markdown(docs)
    }
  } else if (format === 'html') {
    return {
      ext: 'html',
      content: renderer.html(docs)
    }
  } else {
    return {
      ext: 'json',
      content: renderer.json(docs)
    }
  }
}
const apiPlugin = declare((api, opts, dir) => {
  api.assertVersion(7)

  return {
    pre(file) {
      file.set('docs', [])
    },
    visitor: {
      FunctionDeclaration(path, state) {
        const docs = state.file.get('docs');
        docs.push({
          type: 'function',
          name: path.get('id').toString(),
          params: path.get('params').map((paramPath) => {
            return {
              name: paramPath.toString(),
              type: resolveType(paramPath.getTypeAnnotation())
            }
          }),
          return: resolveType(path.get('returnType').getTypeAnnotation()),
          doc: path.node.leadingComments && parseComments(path.node.leadingComments[0].value)
        })
        state.file.set('docs', docs)
        // const name = path.get('id').toString()
      },
      ClassDeclaration(path, state) {
        const docs = state.file.get('docs');
        const classInfo = {
          type: 'class',
          name: path.get('id').toString(),
          constructorInfo: {},
          methodsInfo: [],
          propertiesInfo: []
        }
        docs.push(classInfo)
        state.file.set('docs', docs)
        path.traverse({
          ClassProperty(path) {
            classInfo.propertiesInfo.push({
              name: path.get('key').toString(),
              type: resolveType(path.getTypeAnnotation()),
              doc: [path.node.leadingComments, path.node.trailingComments].filter(Boolean).map((comment) => {
                return parseComments(comment.value)
              }).filter(Boolean)
            })
          },
          ClassMethod(path) {
            if (path.node.kind === 'constructor') {
              classInfo.constructorInfo = {
                params: path.get('params').map((paramPath) => {
                  return {
                    name: paramPath.toString(),
                    type: resolveType(paramPath.getTypeAnnotation()),
                    doc: parseComments(path.node.leadingComments[0].value)
                  }
                })
              }
            } else {
              classInfo.methodsInfo.push({
                name: path.get('key').toString(),
                doc: parseComments(path.node.leadingComments[0].value),
                params: path.get('params').map((paramPath) => {
                  return {
                    name: paramPath.toString(),
                    type: resolveType(paramPath.getTypeAnnotation())
                  }
                }),
                return: resolveType(path.getTypeAnnotation())
              })
            }
          }
        })
      }
    },
    post(file) {
      const docs = file.get('docs')
      const res = generate(docs, opts.format);
      fse.ensureDirSync(opts.outputDir);
      fse.writeFileSync(path.join(opts.outputDir, 'docs' + res.ext), res.content)
    }
  }
})
module.exports = apiPlugin