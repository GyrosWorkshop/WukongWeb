import Action from '../action'
import Codec from './codec'
import API from './api'
import Utility from './utility'

export default function Service() {
  return ({getState, dispatch}) => (next) => {
    const api = API({getState, dispatch, next})
    const utility = Utility({getState, dispatch, next})

    async function onLoad() {
      try {
        await api.fetchUser()
        await api.sendChannel()
      } catch (error) {
        utility.notifyError(error, 'Reload', utility.reloadApp)
        return
      }
      api.receiveMessage(({connect, send}) => async (event, data) => {
        try {
          switch (event) {
            case 'open':
              await api.sendUpnext()
              break
            case 'close':
              await api.sendChannel()
              setTimeout(connect, 5000)
              break
            case 'error':
              utility.notifyError('Connection lost. Reconnecting...')
              break
            case 'UserListUpdated':
              next(Action.Channel.status.create({
                members: data.users.map(Codec.User.decode)
              }))
              break
            case 'Play':
              next(Action.Song.play.create(data.song && {
                ...Codec.Song.decode(data.song),
                player: data.user || '',
                time: (Date.now() / 1000) - (data.elapsed || 0)
              }))
              next(Action.Player.reset.create())
              if (data.downvote) {
                next(Action.Player.downvote.create())
              }
              break
            case 'NextSongUpdate':
              next(Action.Song.preload.create(data.song && {
                ...Codec.Song.decode(data.song)
              }))
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
            await api.sendChannel(prevState)
            await api.sendUpnext()
            break
          case Action.Song.prepend.type:
          case Action.Song.append.type:
          case Action.Song.remove.type:
          case Action.Song.move.type:
          case Action.Song.assign.type:
          case Action.Song.shuffle.type:
            await api.sendUpnext(prevState)
            break
          case Action.Song.sync.type:
            await api.fetchPlaylist()
            await api.sendUpnext()
            break
          case Action.Player.ended.type:
            await api.sendSync()
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
