import 'babel-polyfill'

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {Router} from 'react-router'
import injectTapEventPlugin from 'react-tap-event-plugin'

import {store, history} from './store'
const component = require.context('./component', true, /\.js$/)

const routes = {
  path: '/',
  component: component('./root'),
  childRoutes: [{
    path: 'about',
    component: component('./about')
  }]
}
const app = () => {
  if (__env.production) {
    return (
      <Provider store={store}>
        <Router history={history} routes={routes} />
      </Provider>
    )
  } else {
    const {AppContainer} = require('react-hot-loader')
    const Devtool = require('./devtool').default
    return (
      <AppContainer>
        <Provider store={store}>
          <div>
            <Router history={history} routes={routes} />
            <Devtool />
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
  module.hot.accept(component.id, renderApp)
}
