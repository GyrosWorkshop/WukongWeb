const Webpack = require('./webpack.common')
const clientPackage = require('./package').client

const webpack = new Webpack('production')
webpack.sourcePath('client')
webpack.buildPath('client')
webpack.outputFile('wukong')
webpack.libraryExport('Wukong')
webpack.entryFiles('./index')
webpack.jsLoader()
webpack.jsonPlugin('package.json', clientPackage)
webpack.splitChunks(false)

webpack.build()
