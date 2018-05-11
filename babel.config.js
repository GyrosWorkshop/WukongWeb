module.exports = function(api) {
  api.cache(true)
  const config = {
    presets: [
      ['@babel/preset-env', {
        modules: false,
        useBuiltIns: 'usage'
      }],
      ['@babel/preset-stage-2', {
        decoratorsLegacy: true
      }],
      ['@babel/preset-react']
    ],
    plugins: []
  }
  switch (process.env.NODE_ENV) {
    case 'development':
      config.plugins.push('react-hot-loader/babel')
      break
    case 'production':
      break
    case 'test':
      config.presets[0][1].modules = 'commonjs'
      config.presets[0][1].targets = {
        node: 'current'
      }
      break
  }
  return config
}
