import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import * as OfflinePlugin from 'offline-plugin/runtime'

import Wukong from './client'
import Platform from './platform'
import Devtool from './devtool'
import App from './component/app'

OfflinePlugin.install()

const store = Wukong(Platform, Devtool)
render((
  <Provider store={store}>
    <App>
      {Devtool && <Devtool/>}
    </App>
  </Provider>
), document.getElementById('app'))

