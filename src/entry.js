import 'babel-polyfill'

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'

import {store, history} from './store'
import App from './component/app'

const renderApp = () => {
  render((() => {
    if (__env.production) {
      return (
        <Provider store={store}>
          <App history={history} />
        </Provider>
      )
    } else {
      const {AppContainer} = require('react-hot-loader')
      const Devtool = require('./devtool').default
      return (
        <AppContainer>
          <Provider store={store}>
            <div>
              <App history={history} />
              <Devtool />
            </div>
          </Provider>
        </AppContainer>
      )
    }
  })(), document.getElementById('app'))
}

injectTapEventPlugin()
renderApp()

if (!__env.production && module.hot) {
  module.hot.accept('./component/app', renderApp)
}
