import Action from '../action'
import API from './api'
import Utility from './utility'

export default function Service() {
  return ({getState, dispatch}) => (next) => {
    const api = API(getState, dispatch, next)
    const utility = Utility(getState, dispatch, next)

    async function onLoad() {
      try {
        await api.fetchUser()
      } catch (error) {
        utility.notifyError(error, 'Reload', utility.reloadApp)
        return
      }
      api.receiveMessage(async event => {
        try {
          switch (event) {
            case 'open':
              await api.sendUpnext()
              break
            case 'close':
              await api.sendChannel()
              break
            case 'error':
              utility.notifyError('Connection lost. Reconnecting...')
              break
          }
        } catch (error) {
          utility.notifyError(error)
        }
      })
    }

    async function onAction(action) {
      const prevState = getState()
      next(action)
      try {
        switch (action.type) {
          case Action.User.preferences.type:
            await api.sendUpnext(prevState)
            break
          case Action.Channel.name.type:
            await api.sendChannel(prevState)
            await api.sendUpnext()
            break
          case Action.Song.add.type:
          case Action.Song.remove.type:
          case Action.Song.move.type:
          case Action.Song.assign.type:
          case Action.Song.shuffle.type:
            await api.sendUpnext(prevState)
            break
          case Action.Song.sync.type:
            await api.fetchPlaylist()
            await api.sendUpnext(prevState)
            break
          case Action.Player.ended.type:
            await api.sendEnded()
            break
          case Action.Player.downvote.type:
            await api.sendDownvote()
            break
          case Action.Search.keyword.type:
            await api.sendSearch()
            break
        }
      } catch (error) {
        utility.notifyError(error)
      }
    }

    onLoad()
    return onAction
  }
}
