const { declare } = require('@babel/helper-plugin-utils')
const importModule = require('@babel/helper-module-imports')
const generate = require('@babel/generator').default;
const fse = require('fs-extra');
const path = require('path')
let intlKey = 0;
function nextIntlKey() {
  ++intlKey;
  return `intl${intlKey}`
}

const i18nPlugin = declare((api, options) => {
  function getReplaceExpression(path, value, intlUid) {
    const expressionParams = path.isTemplateLiteral() ? path.node.expressions.map(item => generate(item).code) : null
    let replaceExpression = api.template.ast(`${intlUid}.t('${value}'${expressionParams ? ',' + expressionParams.join(',') : ''})`).expression;
    if (path.findParent(p => p.isJSXAttribute()) && !path.findParent(p => p.isJSXExpressionContainer())) {
      replaceExpression = api.types.JSXExpressionContainer(replaceExpression);
    }
    return replaceExpression;
  }
  function saveMapKey(file, key, value) {
    const allText = file.get('allText')
    allText.push({
      key, value
    })
    file.set('allText', allText)
  }
  return {
    pre(file) {
      file.set('allText', [])
    },
    visitor: {
      Program: {
        enter(path, state) {
          path.traverse({
            ImportDeclaration(path) {
              if (state.importedIntlId) return;
              const source = path.node.source.value
              if (source === 'intl') {
                state.importedIntlId = 'intl';
                return
              }
            },
            'StringLiteral|TemplateLiteral'(path) {

              if (path.node.skipTransformI18n) return;
              if (path.node.leadingComments) {
                path.node.leadingComments = path.node.leadingComments.filter((item) => {
                  if (item.value.includes('i18n-disabled')) {
                    path.node.skipTransformI18n = true
                    return false
                  }
                  return true
                })
              }
              if (path.findParent((p) => p.isImportDeclaration())) {
                path.node.skipTransformI18n = true;
                return;
              }

            }
          })
          if (!state.importedIntlId) {
            state.importedIntlId = importModule.addDefault(path, 'intl', {
              nameHint: path.scope.generateUid('intl')
            }).name
          }
        }
      },
      StringLiteral(path, state) {
        if (path.node.skipTransformI18n) return
        const key = nextIntlKey()
        saveMapKey(state.file, key, path.node.value)
        const replaceAst = getReplaceExpression(path, key, state.importedIntlId)
        path.replaceWith(replaceAst)
        path.skip()
      },
      TemplateLiteral(path, state) {
        if (path.node.skipTransform) {
          return;
        }
        const value = path.get('quasis').map(item => item.node.value.raw).join('{placeholder}');
        if (value) {
          let key = nextIntlKey();
          saveMapKey(state.file, key, value);
          const replaceExpression = getReplaceExpression(path, key, state.importedIntlId);
          path.replaceWith(replaceExpression);
          path.skip();
        }
      }
    },
    post(file) {
      const allText = file.get('allText');
      const intlData = allText.reduce((obj, item) => {
        obj[item.key] = item.value;
        return obj;
      }, {});
      const content = `const resource = ${JSON.stringify(intlData, null, 4)};\nexport default resource;`;
      fse.ensureDirSync(options.outputDir);
      fse.writeFileSync(path.join(options.outputDir, 'zh_cn.js'), content);
      fse.writeFileSync(path.join(options.outputDir, 'en_us.js'), content);
    }
  }
})
module.exports = i18nPlugin