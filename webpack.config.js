const path = require('path')
const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FaviconsPlugin = require('favicons-webpack-plugin')
const Md5HashPlugin = require('webpack-md5-hash')

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
  module: {
    rules: [{
      resource: {
        include: sourcePath,
        test: /\.js$/
      },
      use: [{
        loader: 'babel-loader'
      }]
    }, {
      resource: {
        include: sourcePath,
        test: /\.global\.sss$/
      },
      use: ExtractTextPlugin.extract({
        loader: [{
          loader: 'css-loader',
          query: {
            sourceMap: true
          }
        }, {
          loader: 'postcss-loader',
          query: {
            parser: 'sugarss'
          }
        }],
        fallbackLoader: [{
          loader: 'style-loader'
        }]
      }).split('!')
    }, {
      resource: {
        include: sourcePath,
        test: /\.sss$/,
        not: [/\.global\.sss$/]
      },
      use: ExtractTextPlugin.extract({
        loader: [{
          loader: 'css-loader',
          query: {
            sourceMap: true,
            modules: true,
            importLoaders: 1
          }
        }, {
          loader: 'postcss-loader',
          query: {
            parser: 'sugarss'
          }
        }],
        fallbackLoader: [{
          loader: 'style-loader'
        }]
      }).split('!')
    }, {
      resource: {
        test: /\.(png|eot|svg|ttf|woff|woff2)(\?.*)$/
      },
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }]
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
      context: sourcePath,
      postcss: () => [
        require('postcss-cssnext')()
      ]
    }
  }),
  new HtmlPlugin({
    template: './index.html',
    minify: !production ? undefined : {
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      removeComments: true
    }
  }),
  new ExtractTextPlugin({
    filename: '[contenthash].css',
    allChunks: true,
    disable: !production
  }),
  new FaviconsPlugin({
    logo: './resource/icon.png',
    title: 'Wukong'
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
