import 'babel-polyfill'
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import Wukong from 'wukong-client'

import Platform from './platform'
import App from './component/app'

const Devtool = __env.production ? null : require('./devtool').default
const store = Wukong(Platform, Devtool)

function renderApp() {
  render((() => {
    if (__env.production) {
      return (
        <Provider store={store}>
          <App/>
        </Provider>
      )
    } else {
      const {AppContainer} = require('react-hot-loader')
      return (
        <Provider store={store}>
          <AppContainer>
            <App>
              <Devtool/>
            </App>
          </AppContainer>
        </Provider>
      )
    }
  })(), document.getElementById('app'))
}

renderApp()
if (__env.production) {
  const OfflinePlugin = require('offline-plugin/runtime')
  OfflinePlugin.install()
} else {
  if (module.hot) {
    module.hot.accept('./component/app', renderApp)
  }
}
