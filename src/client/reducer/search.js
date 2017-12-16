import {combineReducers} from 'redux'

import Action from '../action'

function keyword(state = '', action) {
  switch (action.type) {
    case Action.Search.keyword.type:
      return action.keyword
    default:
      return state
  }
}

function results(state = [], action) {
  switch (action.type) {
    case Action.Search.results.type:
      return action.results
    default:
      return state
  }
}

export default combineReducers({
  keyword,
  results
})
