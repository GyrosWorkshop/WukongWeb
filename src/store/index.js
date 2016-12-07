import {createStore, compose, applyMiddleware} from 'redux'
import {routerReducer} from 'react-router-redux'

import reducer from '../reducer'
import connectAPI from '../api'
import connectStorage from '../storage'

export default function Store() {
  const enhancers = [
    applyMiddleware(connectAPI()),
    connectStorage()
  ]
  if (!__env.production) {
    const DevTools = require('../devtools').default
    enhancers.push(DevTools.instrument())
  }
  const fullReducer = (state = {}, action) => {
    const extraReducers = {
      routing: routerReducer
    }
    const appState = {...state}
    const extraState = {}
    let hasChanged = false
    Object.keys(extraReducers).forEach(key => {
      delete appState[key]
      const prev = state[key]
      const next = extraReducers[key](prev, action)
      extraState[key] = next
      hasChanged = hasChanged || prev != next
    })
    const nextAppState = reducer(appState, action)
    hasChanged = hasChanged || appState != nextAppState
    return hasChanged ? {...nextAppState, ...extraState} : state
  }
  return createStore(fullReducer, compose(...enhancers))
}
