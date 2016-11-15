const path = require('path')
const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')

const production = process.env.NODE_ENV == 'production'
const sourcePath = path.join(__dirname, 'src')
const buildPath = path.join(__dirname, 'build')

const config = {
  context: sourcePath,
  entry: './entry',
  output: {
    path: buildPath,
    filename: 'bundle.js',
    publicPath: ''
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/, include: sourcePath,
      loader: 'babel'
    }, {
      test: /\.(png)$/, include: sourcePath,
      loader: 'url?limit=10000'
    }]
  },
  plugins: [],
  devtool: 'source-map',
  devServer: {
    host: process.env.DEV_HOST,
    port: process.env.DEV_PORT
  }
}

config.plugins.push(
  new webpack.EnvironmentPlugin([
    'NODE_ENV'
  ]),
  new webpack.DefinePlugin({__env: {
    production: JSON.stringify(production),
    server: JSON.stringify(process.env.WUKONG_SERVER)
  }}),
  new HtmlPlugin({
    template: './index.html',
    minify: !production ? undefined : {
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      removeComments: true
    }
  })
)

if (production) config.plugins.push(
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(true),
  new webpack.optimize.UglifyJsPlugin()
)

module.exports = config
