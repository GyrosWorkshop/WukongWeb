import {createStore, compose, applyMiddleware} from 'redux'
import {hashHistory} from 'react-router'
import {routerReducer, syncHistoryWithStore} from 'react-router-redux'

import reducer from '../reducer'
import connectAPI from '../api'
import connectStorage from '../storage'

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

const enhancers = [
  applyMiddleware(connectAPI()),
  connectStorage()
]
if (!__env.production) {
  const Devtool = require('../devtool').default
  enhancers.push(Devtool.instrument())
}

export const store = createStore(fullReducer, compose(...enhancers))
export const history = syncHistoryWithStore(hashHistory, store)
