import 'babel-polyfill'

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'

import createStore from './store'
import App from './component/app'

const store = createStore()
const app = () => {
  if (__env.production) {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  } else {
    const {AppContainer} = require('react-hot-loader')
    const DevTools = require('./devtools').default
    return (
      <AppContainer>
        <Provider store={store}>
          <div>
            <App />
            <DevTools />
          </div>
        </Provider>
      </AppContainer>
    )
  }
}
const renderApp = () => render(app(), document.getElementById('app'))

injectTapEventPlugin()
renderApp()
if (!__env.production && module.hot) {
  module.hot.accept('./component/app', renderApp)
}
