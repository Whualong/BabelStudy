const { declare } = require('@babel/helper-plugin-utils')
const importModule = require('@babel/helper-module-imports')
const trackerPlugin = declare(function (api, options) {
  api.assertVersion(7)
  return {
    visitor: {
      Program: {
        enter(path, state) {
          path.traverse({
            ImportDeclaration(path) {
              const requiredPath = path.get('source').node.value.toString()
              if (requiredPath === options.trackerPath) {
                const specifierPath = path.get('specifiers.0')
                if (specifierPath.isImportSpecifier() || specifierPath.isImportDefaultSpecifier() || specifierPath.isImportNamespaceSpecifier()) {
                  state.trackerId = specifierPath.get('local').toString()
                }
                state.trackerAst = api.template.statement(`${state.trackerId}()`)()
                path.skip()
              }
            }
          })
          if (!state.trackerId) {
            state.trackerId = importModule.addDefault(path, 'tracker', {
              nameHint: path.scope.generateUid('tracker')
            }).name
            state.trackerAst = api.template.statement(`${state.trackerId}()`)()
          }
        }
      },
      'FunctionExpression|FunctionDeclaration|ClassMethod|ArrowFunctionExpression'(path, state) {
        if (path.isClassMethod() && path.node.kind === 'constructor') {
          path.skip()
          return
        }
        if (path.isArrowFunctionExpression() && path.get('body').node.type != 'BlockStatement') {
          state.trackerAst = api.template.statement(`${state.trackerId}();return PREV_BODY;`)({ PREV_BODY: path.get('body').node })
          path.get('body').replaceWith(state.trackerAst)
        } else {
          path.get('body').node.body.unshift(state.trackerAst)
        }

      }
    }
  }
})
module.exports = trackerPlugin