import Action from '../action'

export default function channel(state = {}, action) {
  switch (action.type) {
    case Action.Channel.status.type:
      return {...action.status}
    default:
      return state
  }
}
