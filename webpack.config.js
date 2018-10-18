require('dotenv').config()
const path = require('path')
const webpack = require('webpack')

const package = require('./package')

module.exports = (env, {mode}) => {
  const client = new Webpack('client', mode)
  client.sourcePath('client')
  client.buildPath('client')
  client.outputFile('wukong')
  client.libraryExport('Wukong')
  client.entryFiles('./index')
  client.jsLoader()
  client.jsonPlugin('package.json', package.client)

  const webapp = new Webpack('webapp', mode)
  webapp.sourcePath('.')
  webapp.buildPath('webapp')
  webapp.publicPath('/')
  webapp.outputFile()
  webapp.entryFiles('./entry')
  webapp.jsLoader()
  webapp.cssLoader()
  webapp.fileLoader()
  webapp.definePlugin({
    process: {
      env: {
        API_SERVER: JSON.stringify(process.env.API_SERVER)
      }
    }
  })
  webapp.htmlPlugin('./index.html', {
    comment: `Wukong v${package.version}`
  })
  webapp.faviconPlugin('./resource/icon.png', 'Wukong')
  webapp.offlinePlugin(package.version)
  webapp.splitChunks()
  webapp.hotModule()

  return [client, webapp].map(item => item.config)
}

class Webpack {
  constructor(name, mode) {
    process.env.NODE_ENV = mode
    this.data = {
      name: name,
      mode: mode,
      prod: mode == 'production',
      devHost: process.env.DEV_HOST,
      devPort: parseInt(process.env.DEV_PORT)
    }
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
      performance: {},
      devServer: {}
    }
    this.commonSetup()
  }

  commonSetup() {
    this.config.name = this.data.name
    this.config.mode = this.data.mode
    this.config.plugins.push(
      new webpack.ProgressPlugin()
    )
    this.config.performance.hints = this.data.prod && 'warning'
    this.config.devServer.host = this.data.devHost
    this.config.devServer.port = this.data.devPort
  }

  sourcePath(directory) {
    this.data.sourcePath = path.join(__dirname, 'src', directory)
    this.config.context = this.data.sourcePath
  }

  buildPath(directory) {
    this.data.buildPath = path.join(__dirname, 'build', directory)
    this.config.output.path = this.data.buildPath
  }

  publicPath(path) {
    this.data.publicPath = this.data.prod ? path : '/'
    this.config.output.publicPath = this.data.publicPath
  }

  outputFile(basename) {
    this.data.basename = basename ||
      (this.data.prod ? '[contenthash]' : '[name]')
    this.config.output.filename = `${this.data.basename}.js`
    this.config.output.chunkFilename = `${this.data.basename}.js`
  }

  libraryExport(name) {
    this.config.output.globalObject = 'this'
    this.config.output.libraryTarget = 'umd'
    this.config.output.library = name
  }

  entryFiles(...files) {
    this.config.entry.push(...files)
  }

  jsLoader() {
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
      new UglifyJsPlugin()
    )
  }

  cssLoader() {
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
    this.config.plugins.push(
      new ExtractCssPlugin({
        filename: `${this.data.basename}.css`,
        chunkFilename: `${this.data.basename}.css`
      })
    )
    this.config.optimization.minimizer.push(
      new MinifyCssPlugin()
    )
  }

  fileLoader() {
    this.config.module.rules.push({
      resource: {
        test: /\.(png|eot|svg|ttf|woff|woff2)(\?.*)?$/
      },
      use: [{
        loader: 'file-loader',
        options: {
          name: `${this.data.prod ? '[hash]' : '[path][name]'}.[ext]`
        }
      }]
    })
  }

  definePlugin(definitions) {
    this.config.plugins.push(
      new webpack.DefinePlugin(definitions)
    )
  }

  jsonPlugin(filename, value) {
    const GenerateJsonPlugin = require('generate-json-webpack-plugin')
    this.config.plugins.push(
      new GenerateJsonPlugin(filename, value)
    )
  }

  htmlPlugin(template, parameters) {
    const HtmlPlugin = require('html-webpack-plugin')
    this.config.plugins.push(
      new HtmlPlugin({
        template: template,
        templateParameters: parameters,
        minify: this.data.prod && {
          collapseWhitespace: true
        }
      })
    )
  }

  faviconPlugin(image, title) {
    const FaviconsPlugin = require('favicons-webpack-plugin')
    this.config.plugins.push(
      new FaviconsPlugin({
        logo: image,
        title: title,
        prefix: './',
        persistentCache: false,
        icons: {
          favicons: true,
          appleIcon: false,
          appleStartup: false,
          android: false,
          windows: false,
          firefox: false,
          coast: false,
          yandex: false,
          opengraph: false,
          twitter: false
        }
      })
    )
  }

  offlinePlugin(version) {
    const OfflinePlugin = require('offline-plugin')
    this.config.plugins.push(
      new OfflinePlugin({
        version: version,
        updateStrategy: 'all',
        appShell: this.data.publicPath,
        autoUpdate: true,
        ServiceWorker: {
          events: true
        },
        AppCache: false
      })
    )
  }

  splitChunks() {
    this.config.optimization.runtimeChunk = 'single'
    this.config.optimization.splitChunks = {
      chunks: 'all'
    }
  }

  hotModule() {
    if (this.data.prod) return
    this.config.devServer.hotOnly = true
    this.config.plugins.push(
      new webpack.HotModuleReplacementPlugin()
    )
  }
}
