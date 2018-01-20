const path = require('path')
const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FaviconsPlugin = require('favicons-webpack-plugin')
const OfflinePlugin = require('offline-plugin')

const sourcePath = path.join(__dirname, 'src')
const buildPath = path.join(__dirname, 'build')
const vendorPath = path.join(__dirname, 'node_modules')
const clientPath = path.join(sourcePath, 'client')
const version = require('./package').version

const notBoolean = value => value !== true && value !== false

module.exports = function(env = {}) {
  const production = env.production || false
  const devHost = env.devHost || 'localhost'
  const devPort = env.devPort || 8080
  const devServer = `http://${devHost}:${devPort}`
  const apiServer = env.apiServer || 'https://api5.wukongmusic.us'

  process.env.NODE_ENV = production ? 'production' : 'development'

  return [{
    name: 'client',
    context: clientPath,
    output: {
      path: clientPath,
      filename: 'wukong.js',
      library: 'Wukong',
      libraryTarget: 'this'
    },
    module: {
      rules: [{
        resource: {
          include: clientPath,
          test: /\.js$/
        },
        use: [{
          loader: 'babel-loader'
        }]
      }]
    },
    entry: [
      './index'
    ],
    plugins: [
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'production'
      }),
      new webpack.ProgressPlugin({
        profile: false
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true
      })
    ],
    devtool: 'source-map',
    performance: {
      hints: false
    }
  }, {
    name: 'webapp',
    context: sourcePath,
    output: {
      path: buildPath,
      publicPath: production ? '/' : `${devServer}/`,
      filename: production ? '[chunkhash].js' : '[name].[hash].js',
      chunkFilename: production ? '[chunkhash].js' : '[name].[hash].js'
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
          test: /\.global\.css$/
        },
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }, {
            loader: 'postcss-loader'
          }],
          fallback: [{
            loader: 'style-loader'
          }]
        })
      }, {
        resource: {
          include: sourcePath,
          test: /\.css$/,
          not: [/\.global\.css$/]
        },
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: production ? '[hash:base64]' : '[name]-[local]',
              importLoaders: 1
            }
          }, {
            loader: 'postcss-loader'
          }],
          fallback: [{
            loader: 'style-loader'
          }]
        })
      }, {
        resource: {
          test: /\.(png|eot|svg|ttf|woff|woff2)(\?.*)?$/
        },
        use: [{
          loader: 'file-loader'
        }]
      }]
    },
    entry: [
      production || 'react-hot-loader/patch',
      production || 'webpack/hot/only-dev-server',
      production || `webpack-dev-server/client?${devServer}`,
      './entry'
    ].filter(notBoolean),
    plugins: [
      new webpack.EnvironmentPlugin({
        NODE_ENV: production ? 'production' : 'development'
      }),
      new webpack.DefinePlugin({__env: {
        production: JSON.stringify(production),
        server: JSON.stringify(apiServer)
      }}),
      new webpack.LoaderOptionsPlugin({
        debug: !production,
        minimize: production,
        options: {
          context: sourcePath
        }
      }),
      new webpack.ProgressPlugin({
        profile: false
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: (module, count) => module.context.startsWith(vendorPath)
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        minChunks: Infinity
      }),
      new HtmlPlugin({
        template: './index.ejs',
        comment: `Wukong v${version}`,
        minify: !production ? undefined : {
          collapseWhitespace: true
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
      }),
      production && new OfflinePlugin({
        version: version,
        cacheMaps: [{
          match: 'function(url) { return new URL(\'/\', location) }',
          requestTypes: ['navigate']
        }],
        AppCache: false
      }),
      production && new webpack.optimize.UglifyJsPlugin({
        sourceMap: true
      }),
      production || new webpack.HotModuleReplacementPlugin(),
      production || new webpack.NamedModulesPlugin()
    ].filter(notBoolean),
    devtool: 'source-map',
    devServer: {
      host: devHost,
      port: devPort,
      contentBase: buildPath,
      historyApiFallback: true,
      hot: true
    },
    performance: {
      hints: production && 'warning'
    }
  }]
}
