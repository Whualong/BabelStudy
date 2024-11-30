const path = require('path')
module.exports = [
  './track.js',
  './i18n.js'
].map((item)=>{
  return path.join(__dirname,item)
})