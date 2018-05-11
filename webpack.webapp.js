const Webpack = require('./webpack.common')

const webpack = new Webpack()
webpack.prod(true) // TODO
webpack.path('.', 'webapp')
webpack.bundle('/')
webpack.entry('./entry')
webpack.babel()
webpack.postcss()
webpack.splitChunks(true)
