import {combineReducers} from 'redux'

import Action from '../action'

function notification(state = {}, action) {
  switch (action.type) {
    case Action.Misc.notification.type:
      return action.notification
    default:
      return state
  }
}

export default combineReducers({
  notification
})
