import {combineReducers} from 'redux'

import Action from '../action'

function profile(state = {}, action) {
  switch (action.type) {
    case Action.User.profile.type:
      return action.profile
    default:
      return state
  }
}

function preferences(state = {}, action) {
  switch (action.type) {
    case Action.User.preferences.type:
      return {
        listenOnly: false,
        connection: 0,
        theme: 0,
        ...action.preferences
      }
    default:
      return state
  }
}

export default combineReducers({
  profile,
  preferences
})
