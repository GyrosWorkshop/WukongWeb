const path = require('path')
const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const Md5HashPlugin = require('webpack-md5-hash')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const sourcePath = path.join(__dirname, 'src')
const buildPath = path.join(__dirname, 'build')
const production = process.env.NODE_ENV == 'production'
const devHost = process.env.DEV_HOST || 'localhost'
const devPort = parseInt(process.env.DEV_PORT) || 8080

const config = {
  context: sourcePath,
  output: {
    path: buildPath,
    filename: production ? '[chunkhash].js' : 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/, include: sourcePath,
      loader: 'babel-loader'
    }, {
      test: /\.(png)$/, include: sourcePath,
      loader: 'url-loader?limit=1000'
    }]
  },
  entry: [],
  plugins: [],
  devtool: 'source-map',
  devServer: {
    host: devHost,
    port: devPort,
    contentBase: false,
    hot: true
  }
}

config.entry.push(
  './entry'
)
config.plugins.push(
  new webpack.EnvironmentPlugin([
    'NODE_ENV'
  ]),
  new webpack.DefinePlugin({__env: {
    production: JSON.stringify(production),
    server: JSON.stringify(process.env.WUKONG_SERVER)
  }}),
  new webpack.LoaderOptionsPlugin({
    debug: !production,
    minimize: production,
    options: {
      context: __dirname
    }
  }),
  new FaviconsWebpackPlugin({
    logo: './resource/icon-merge.png',
    title: 'Wukong'
  }),
  new HtmlPlugin({
    template: './index.html',
    minify: !production ? undefined : {
      collapseWhitespace: true,
      preserveLineBreaks: true,
      collapseBooleanAttributes: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      removeComments: true
    }
  })
)

if (production) {
  config.plugins.push(
    new Md5HashPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    })
  )
} else {
  config.entry.unshift(
    'react-hot-loader/patch',
    'webpack/hot/only-dev-server',
    `webpack-dev-server/client?http://${devHost}:${devPort}`
  )
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  )
}

module.exports = config
