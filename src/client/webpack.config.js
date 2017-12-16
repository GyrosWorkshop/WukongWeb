const path = require('path')
const webpack = require('webpack')

const sourcePath = path.join(__dirname, 'src')
const buildPath = path.join(__dirname, 'build')

const config = {
  context: sourcePath,
  output: {
    path: buildPath,
    filename: 'wukong.js',
    library: 'Wukong',
    libraryTarget: 'this'
  },
  module: {
    rules: [{
      resource: {
        include: sourcePath,
        test: /\.js$/
      },
      use: [{
        loader: 'babel-loader'
      }]
    }]
  },
  entry: [
    'babel-polyfill',
    './index'
  ],
  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV'
    ]),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    })
  ],
  devtool: 'source-map',
  performance: {
    hints: false
  }
}

module.exports = config
