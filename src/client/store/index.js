import {createStore, compose, applyMiddleware} from 'redux'

import reducer from '../reducer'
import connectService from '../service'
import connectStorage from '../storage'

export default function Store(Platform, enhancer) {
  const enhancers = [
    applyMiddleware(connectService(Platform)),
    connectStorage(Platform)
  ]
  if (enhancer) {
    enhancers.push(enhancer)
  }
  return createStore(reducer, compose(...enhancers))
}
