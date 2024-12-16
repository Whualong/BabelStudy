const trackerPlugin = require('./tracker')
const i18nPlugin = require('./i18n')
const apiPlugin = require('./api')
const path = require('path')
module.exports = [
  {
    plugin: trackerPlugin,
    options: {
      trackerPath: 'tracker'
    }
  },
  {
    plugin: i18nPlugin,
    options: {
      outputDir: path.join(__dirname, '../locale')
    }
  },
  {
    plugin: apiPlugin,
    options: {
      outputDir: path.join(__dirname, '../bundle'),
      format: 'markdown'
    }
  }

]