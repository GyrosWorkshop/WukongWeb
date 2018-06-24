import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'

import Wukong from './client'
import Platform from './platform'
import App from './component/app'

if (process.env.NODE_ENV == 'production') {
  const OfflinePlugin = require('offline-plugin/runtime')
  OfflinePlugin.install()
}

const store = Wukong(Platform)
render((
  <Provider store={store}>
    <App/>
  </Provider>
), document.getElementById('app'))
