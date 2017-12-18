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


function connection(state = {}, action) {
  switch (action.type) {
    case Action.Misc.connection.type:
      return action.connection
    default:
      return state
  }
}

export default combineReducers({
  notification,
  connection
})
