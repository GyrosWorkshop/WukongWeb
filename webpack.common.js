require('dotenv').config()
const path = require('path')
const webpack = require('webpack')

module.exports = class Webpack {
  constructor() {
    this.data = {}
    this.config = {
      output: {},
      entry: [],
      module: {
        rules: []
      },
      plugins: [],
      optimization: {
        minimizer: []
      },
      performance: {}
    }
  }

  prod(prod) {
    this.data.prod = !!prod
    this.data.env = prod ? 'production' : 'development'
    this.config.mode = this.data.env
    process.env.NODE_ENV = this.data.env
    this.config.plugins.push(
      new webpack.ProgressPlugin()
    )
    this.config.devtool = 'source-map'
    this.config.performance.hints = this.data.prod && 'warning'
  }

  path(source, build) {
    this.data.sourcePath = path.join(__dirname, 'src', source)
    this.data.buildPath = path.join(__dirname, 'build', build)
    this.config.context = this.data.sourcePath
    this.config.output.path = this.data.buildPath
  }

  library(filename, library) {
    this.config.output.filename = filename
    this.config.output.library = library
    this.config.output.libraryTarget = 'this'
  }

  bundle(publicPath) {
    this.config.publicPath = publicPath
    this.filename = this.data.prod ? '[contenthash].js' : '[name].js'
    this.chunkFilename = this.data.prod ? '[contenthash].js' : '[name].js'
  }

  entry(...files) {
    this.config.entry.push(...files)
  }

  babel() {
    const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
    this.config.module.rules.push({
      resource: {
        include: this.data.sourcePath,
        test: /\.js$/
      },
      use: [{
        loader: 'babel-loader'
      }]
    })
    this.config.optimization.minimizer.push(
      new UglifyJsPlugin({
        sourceMap: true
      })
    )
  }

  postcss() {
    const ExtractCssPlugin = require('mini-css-extract-plugin')
    const MinifyCssPlugin = require('optimize-css-assets-webpack-plugin')
    this.config.module.rules.push({
      resource: {
        include: this.data.sourcePath,
        test: /\.global\.css$/
      },
      use: [this.data.prod ? ExtractCssPlugin.loader : {
        loader: 'style-loader',
        options: {
          convertToAbsoluteUrls: !this.data.prod
        }
      }, {
        loader: 'css-loader'
      }, {
        loader: 'postcss-loader'
      }]
    }, {
      resource: {
        include: this.data.sourcePath,
        test: /\.css$/,
        not: [/\.global\.css$/]
      },
      use: [this.data.prod ? ExtractCssPlugin.loader : {
        loader: 'style-loader',
        options: {
          convertToAbsoluteUrls: !this.data.prod
        }
      }, {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: this.data.prod ? '[hash:base64]' : '[name]-[local]',
          importLoaders: 1
        }
      }, {
        loader: 'postcss-loader'
      }]
    })
    this.config.optimization.minimizer.push(
      new MinifyCssPlugin({
        cssProcessorOptions: {
          map: {
            inline: false
          }
        }
      })
    )
  }

  json(filename, object) {
    const GenerateJsonPlugin = require('generate-json-webpack-plugin')
    this.config.plugins.push(
      new GenerateJsonPlugin(filename, object)
    )
  }

  splitChunks(enabled) {
    this.config.optimization.runtimeChunk = enabled && 'single'
    this.config.optimization.splitChunks = enabled && {
      chunks: 'all'
    }
  }
}
