import {combineReducers} from 'redux'

import Action from '../action'

function members(state = [], action) {
  switch (action.type) {
    case Action.Channel.members.type:
      return action.members
    default:
      return state
  }
}

export default combineReducers({
  members
})
