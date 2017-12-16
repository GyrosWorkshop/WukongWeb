import {createStore, compose, applyMiddleware} from 'redux'

import reducer from '../reducer'
import connectService from '../service'
import connectStorage from '../storage'

export default function Store(Platform, Devtool) {
  const enhancers = [
    applyMiddleware(connectService(Platform)),
    connectStorage(Platform)
  ]
  if (Devtool) {
    enhancers.push(Devtool.instrument())
  }
  return createStore(reducer, compose(...enhancers))
}
