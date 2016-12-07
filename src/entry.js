import 'babel-polyfill'

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {Router, hashHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'

import createStore from './store'
import createRoutes from './routes'

const store = createStore()
const routes = createRoutes()
const history = syncHistoryWithStore(hashHistory, store)
const app = () => {
  if (__env.production) {
    return (
      <Provider store={store}>
        <Router routes={routes} history={history} />
      </Provider>
    )
  } else {
    const {AppContainer} = require('react-hot-loader')
    const DevTools = require('./devtools').default
    return (
      <AppContainer>
        <Provider store={store}>
          <div>
            <Router routes={routes} history={history} />
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
  module.hot.accept('./component/home', renderApp)
}
