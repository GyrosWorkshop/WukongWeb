const Webpack = require('./webpack.common')
const webappVersion = require('./package').version

const command = process.argv[2] || 'build'
const env = command == 'build' ? 'production' : 'development'

const webpack = new Webpack(env)
webpack.sourcePath('.')
webpack.buildPath('webapp')
webpack.publicPath('/')
webpack.outputFile()
webpack.entryFiles('./entry')
webpack.jsLoader()
webpack.cssLoader()
webpack.fileLoader()
webpack.definePlugin({
  process: {
    env: {
      API_SERVER: JSON.stringify(process.env.API_SERVER)
    }
  }
})
webpack.htmlPlugin('./index.html', {
  comment: `Wukong v${webappVersion}`
})
webpack.splitChunks(true)

switch (command) {
  case 'build':
    webpack.faviconPlugin('./resource/icon.png', 'Wukong')
    webpack.offlinePlugin(webappVersion)
    webpack.build()
    break
  case 'serve':
    webpack.serve()
    break
}
