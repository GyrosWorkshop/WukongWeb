const Webpack = require('./webpack.common')

const webpack = new Webpack()
webpack.prod(true)
webpack.path('client', 'client')
webpack.library('wukong.js', 'Wukong')
webpack.entry('./index')
webpack.babel()
webpack.json('package.json', (() => {
  const object = require('./package').client
  object.version = '0.1.1'
  return object
})())
webpack.splitChunks(false)
