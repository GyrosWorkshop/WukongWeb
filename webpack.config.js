const path = require('path')
const webpack = require('webpack')
const CssExtractPlugin = require('mini-css-extract-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const GenerateJsonPlugin = require('generate-json-webpack-plugin')
const FaviconsPlugin = require('favicons-webpack-plugin')
const OfflinePlugin = require('offline-plugin')

const sourcePath = path.join(__dirname, 'src')
const buildPath = path.join(__dirname, 'build')
const clientPath = path.join(sourcePath, 'client')
const webappPackage = require('./package')
const webappVersion = webappPackage.version
const clientPackage = webappPackage.client
clientPackage.version = '0.1.1'

const notBoolean = value => value !== true && value !== false

module.exports = function(env = {}) {
  const production = env.production || false
  const devHost = env.devHost || 'localhost'
  const devPort = env.devPort || 8080
  const devServer = `http://${devHost}:${devPort}`
  const apiServer = env.apiServer || 'https://wukong.leeleo.me'
  const mode = production ? 'production' : 'development'
  process.env.NODE_ENV = mode

  return [{
    name: 'client',
    mode: mode,
    context: clientPath,
    output: {
      path: buildPath,
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
      new webpack.ProgressPlugin(),
      new GenerateJsonPlugin('package.json', clientPackage)
    ],
    devtool: 'source-map',
    optimization: {
      runtimeChunk: false,
      splitChunks: false,
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: true
        })
      ]
    },
    performance: {
      hints: false
    }
  }, {
    name: 'webapp',
    mode: mode,
    context: sourcePath,
    output: {
      path: buildPath,
      publicPath: production ? '/' : `${devServer}/`,
      filename: production ? '[contenthash].js' : '[name].js',
      chunkFilename: production ? '[contenthash].js' : '[name].js'
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
        use: [production ? CssExtractPlugin.loader : {
          loader: 'style-loader'
        }, {
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: true
          }
        }]
      }, {
        resource: {
          include: sourcePath,
          test: /\.css$/,
          not: [/\.global\.css$/]
        },
        use: [production ? CssExtractPlugin.loader : {
          loader: 'style-loader'
        }, {
          loader: 'css-loader',
          options: {
            sourceMap: true,
            modules: true,
            localIdentName: production ? '[hash:base64]' : '[name]-[local]',
            importLoaders: 1
          }
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: true
          }
        }]
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
      new webpack.ProgressPlugin(),
      new webpack.DefinePlugin({__env: {
        production: JSON.stringify(production),
        server: JSON.stringify(apiServer)
      }}),
      new CssExtractPlugin({
        filename: production ? '[contenthash].css' : '[name].css',
        chunkFilename: production ? '[contenthash].css' : '[name].css'
      }),
      new HtmlPlugin({
        template: './index.ejs',
        comment: `Wukong v${webappVersion}`,
        minify: !production ? undefined : {
          collapseWhitespace: true
        }
      }),
      new FaviconsPlugin({
        logo: './resource/icon.png',
        title: 'Wukong'
      }),
      production && new OfflinePlugin({
        version: webappVersion,
        updateStrategy: 'all',
        appShell: '/'
      }),
      production || new webpack.HotModuleReplacementPlugin()
    ].filter(notBoolean),
    devtool: 'source-map',
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all'
      },
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: true
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            map: {
              inline: false
            }
          }
        })
      ]
    },
    performance: {
      hints: production && 'warning'
    },
    devServer: {
      host: devHost,
      port: devPort,
      contentBase: buildPath,
      historyApiFallback: true,
      hot: true
    }
  }]
}
