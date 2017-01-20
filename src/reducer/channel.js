import {combineReducers} from 'redux'

import Action from '../action'

function name(state = '', action) {
  switch (action.type) {
    case Action.Channel.name.type:
      return action.name
    default:
      return state
  }
}

function members(state = [], action) {
  switch (action.type) {
    case Action.Channel.members.type:
      return action.members
    default:
      return state
  }
}

export default combineReducers({
  name,
  members
})
