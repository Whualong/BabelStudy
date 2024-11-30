const trackerPlugin = require('./tracker')
const i18nPlugin = require('./i18n')
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

    }
  }

]