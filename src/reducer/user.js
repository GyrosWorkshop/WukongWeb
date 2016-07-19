import Action from '../action'

export default function user(state = {}, action) {
  switch (action.type) {
    case Action.User.profile.type:
      return {...state, ...action.profile}
    default:
      return state
  }
}
