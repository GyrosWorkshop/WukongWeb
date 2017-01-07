import {combineReducers} from 'redux'
import {isEmpty} from 'lodash'

import Action from '../action'

function profile(state = {}, action) {
  switch (action.type) {
    case Action.User.profile.type:
      return action.profile
    default:
      return state
  }
}

function preferences(state, action) {
  const defaults = {
    listenOnly: false,
    connection: 0,
    audioQuality: 0,
    theme: 0
  }
  if (isEmpty(state)) state = defaults
  switch (action.type) {
    case Action.User.preferences.type:
      return {
        ...state,
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
