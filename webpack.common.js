require('dotenv').config()
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const serve = require('webpack-serve')

module.exports = class Webpack {
  constructor(env) {
    process.env.NODE_ENV = env
    this.data = {
      env: env,
      prod: env == 'production',
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
      performance: {}
    }
    this.commonSetup()
  }

  commonSetup() {
    this.config.mode = this.data.env
    this.config.plugins.push(
      new webpack.ProgressPlugin()
    )
    this.config.performance.hints = this.data.prod && 'warning'
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

  splitChunks(enabled) {
    this.config.optimization.runtimeChunk = enabled && 'single'
    this.config.optimization.splitChunks = enabled && {
      chunks: 'all'
    }
  }

  build() {
    try {
      webpack(this.config).run((error, stats) => {
        if (error) {
          this.printError(error)
        } else {
          this.printStats(stats)
        }
      })
    } catch (error) {
      this.printError(error)
    }
  }

  serve() {
    try {
      const history = require('connect-history-api-fallback')
      const convert = require('koa-connect')
      serve({
        config: this.config,
        content: __dirname,
        host: this.data.devHost,
        port: this.data.devPort,
        dev: {
          publicPath: this.data.publicPath
        },
        hot: {
          port: this.data.devPort + 1
        },
        add: (app, middleware, options) => {
          app.use(convert(history()))
        }
      })
    } catch (error) {
      this.printError(error)
    }
  }

  /* eslint-disable no-console */
  printError(error) {
    console.error(error.stack || error)
    if (error.details) {
      console.error(error.details)
    }
    process.exitCode = 1
  }

  printStats(stats) {
    console.log(stats.toString({
      colors: true
    }))
    fs.writeFileSync(
      path.join(
        path.dirname(this.data.buildPath),
        `${path.basename(this.data.buildPath)}.json`
      ),
      JSON.stringify(stats.toJson())
    )
    if (stats.hasErrors()) {
      process.exitCode = 2
    }
  }
  /* eslint-enable no-console */
}
