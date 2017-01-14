import 'babel-polyfill'
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'

import store from './store'
import App from './component/app'

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
      const Devtool = require('./devtool').default
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
if (!__env.production && module.hot) {
  module.hot.accept('./component/app', renderApp)
}
