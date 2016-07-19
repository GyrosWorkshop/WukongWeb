import {createStore, compose, applyMiddleware} from 'redux'

import reducer from '../reducer'
import connectAPI from '../api'
import connectStorage from '../storage'

export default function Store() {
  const enhancers = [
    applyMiddleware(connectAPI()),
    connectStorage()
  ]
  if (!__env.production) {
    const DevTools = require('../component/devtools').default
    enhancers.push(DevTools.instrument())
  }
  return createStore(reducer, compose(...enhancers))
}
