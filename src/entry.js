import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'

import Wukong from './client'
import Platform from './platform'
import enhancer from './enhancer'
import App from './component/app'

const store = Wukong(Platform, enhancer)

render((
  <Provider store={store}>
    <App/>
  </Provider>
), document.getElementById('app'))
