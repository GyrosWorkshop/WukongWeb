module.exports = function(api) {
  return {
    presets: [
      ['@babel/preset-env', {
        modules: false, // test: 'commonjs'
        useBuiltIns: 'usage'
        // test targets: {node: 'current'}
      }],
      ['@babel/preset-stage-2', {
        decoratorsLegacy: true
      }],
      ['@babel/preset-react']
    ],
    plugins: [
      'react-hot-loader/babel'
    ]
  }
}
