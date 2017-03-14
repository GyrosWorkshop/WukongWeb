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

function auth(state = {}, action) {
  switch (action.type) {
    case Action.User.auth.type:
      return action.auth
    default:
      return state
  }
}

function preferences(state = {}, action) {
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
  auth,
  preferences
})
