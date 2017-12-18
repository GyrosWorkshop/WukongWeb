import Action from '../action'
import API from './api'
import Utility from './utility'

export default function Service(Platform) {
  return ({getState, dispatch}) => (next) => {
    const api = API(Platform, getState, dispatch)
    const utility = Utility(Platform, getState, dispatch)

    async function onLoad() {
      try {
        await api.fetchUser()
        await api.fetchPreferences()
      } catch (error) {
        utility.notifyError(error.message)
        return
      }
      api.receiveMessage(async event => {
        const state = getState()
        try {
          switch (event) {
            case 'connected':
              await api.sendUpnext()
              break
            case 'interrupted':
              utility.notifyError('Connection lost. Reconnecting...')
              await api.sendChannel()
              break
            case 'disconnected':
              utility.notifyError(
                state.misc.connection.message,
                'Reload',
                utility.reloadApp
              )
              break
          }
        } catch (error) {
          utility.notifyError(error.message)
        }
      })
    }

    async function onAction(action) {
      const prevState = getState()
      next(action)
      try {
        switch (action.type) {
          case Action.User.auth.type:
            await api.processAuth()
            break
          case Action.User.preferences.type:
            await api.sendUpnext(prevState)
            await api.sendPreferences(prevState)
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
        utility.notifyError(error.message)
      }
    }

    onLoad()
    return onAction
  }
}
