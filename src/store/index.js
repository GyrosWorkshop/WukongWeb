import {createStore, compose, applyMiddleware} from 'redux'

import reducer from '../reducer'
import connectService from '../service'
import connectStorage from '../storage'

const enhancers = [
  applyMiddleware(connectService()),
  connectStorage()
]
if (!__env.production) {
  const Devtool = require('../devtool').default
  enhancers.push(Devtool.instrument())
}

export default createStore(reducer, compose(...enhancers))
