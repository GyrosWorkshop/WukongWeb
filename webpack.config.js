const path = require('path')
const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FaviconsPlugin = require('favicons-webpack-plugin')
const OfflinePlugin = require('offline-plugin')

const sourcePath = path.join(__dirname, 'src')
const buildPath = path.join(__dirname, 'build')
const vendorPath = path.join(__dirname, 'node_modules')
const version = process.env.npm_package_version
const production = process.env.NODE_ENV == 'production'
const devHost = process.env.DEV_HOST || 'localhost'
const devPort = parseInt(process.env.DEV_PORT) || 8080
const devServer = `http://${devHost}:${devPort}`
const apiServer = process.env.WUKONG_SERVER || 'https://api.wukongmusic.us'

const config = {
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
          query: {
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
          query: {
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
  entry: [],
  plugins: [],
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
    server: JSON.stringify(apiServer)
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
  })
)

if (production) {
  config.plugins.push(
    new OfflinePlugin({
      version: version,
      cacheMaps: [{
        match: 'url => new URL(\'/\', location)',
        requestTypes: ['navigate']
      }]
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    })
  )
} else {
  config.entry.unshift(
    'react-hot-loader/patch',
    'webpack/hot/only-dev-server',
    `webpack-dev-server/client?${devServer}`
  )
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  )
}

module.exports = config
