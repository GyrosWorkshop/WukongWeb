import partial from 'lodash/partial'
import isEqual from 'lodash/isEqual'

import Action from '../action'
import Codec from './codec'

export default function API(Platform, getState, dispatch) {
  const httpGet = partial(Platform.Network.http, 'GET')
  const httpPost = partial(Platform.Network.http, 'POST')
  Platform.Network.hook(
    (method, endpoint, status, error) => {
      if (status == 401) {
        dispatch(Action.User.auth.create({status: false}))
        throw new Error('You have to sign in to continue.')
      }
      if (error) {
        throw new Error(`${error}: ${method} ${endpoint}`)
      }
    }
  )

  const api = {}

  api.processAuth = async () => {
    const state = getState()
    const auth = state.user.auth
    if (auth.status) return
    if (auth.providers) {
      const {providers, selected} = auth
      const provider = providers.length == 1
        ? providers[0]
        : providers.find(provider => provider.id == selected)
      if (provider) {
        Platform.App.webview(Platform.Network.url('http', provider.url + '?'
          + `redirectUri=${encodeURIComponent(Platform.App.url())}`
        ))
      }
    } else {
      const data = await httpGet('/oauth/all')
      const providers = data.map(item => ({
        id: item.scheme,
        name: item.displayName,
        url: item.url
      }))
      dispatch(Action.User.auth.create({providers}))
    }
  }

  api.fetchUser = async () => {
    const data = await httpGet('/api/user/userinfo')
    const profile = Codec.User.decode(data)
    dispatch(Action.User.profile.create(profile))
  }

  api.fetchPreferences = async () => {
    const data = await httpGet('/api/user/configuration')
    const preferences = Codec.Preferences.decode(data)
    dispatch(Action.User.preferences.create(preferences))
  }

  api.fetchPlaylist = async () => {
    const state = getState()
    const sync = state.user.preferences.sync
    if (!sync) return
    const urls = sync.split('\n').filter(line => line)
    if (!urls.length) return
    const data = await Promise.all(urls.map(url =>
      httpPost('/provider/songListWithUrl', {
        url,
        withCookie: state.user.preferences.cookie
      })
    ))
    const songs = []
      .concat(...data.map(item => item.songs || []))
      .map(Codec.Song.decode)
    dispatch(Action.Song.assign.create(songs))
  }

  api.sendPreferences = async prevState => {
    const state = getState()
    const preferences = Codec.Preferences.encode(state.user.preferences)
    const prevPreferences = prevState &&
      Codec.Preferences.encode(prevState.user.preferences)
    if (prevState && isEqual(preferences, prevPreferences)) return
    await httpPost('/api/user/configuration',
      preferences
    )
  }

  api.sendChannel = async prevState => {
    const state = getState()
    const channel = state.channel.name
    if (!channel) return
    const prevChannel = prevState && prevState.channel.name
    if (channel == prevChannel) return
    await httpPost(`/api/channel/join/${channel}`)
  }

  api.sendUpnext = async prevState => {
    const state = getState()
    if (!state.channel.name) return
    const song = Codec.Song.encode(
      state.user.preferences.listenOnly
        ? undefined
        : state.song.playlist[0]
    )
    const prevSong = prevState && Codec.Song.encode(
      prevState.user.preferences.listenOnly
        ? undefined
        : prevState.song.playlist[0]
    )
    if (prevState && isEqual(song, prevSong)) return
    await httpPost('/api/channel/updateNextSong', {
      ...song,
      withCookie: state.user.preferences.cookie
    })
  }

  api.sendEnded = async () => {
    const state = getState()
    if (!state.channel.name) return
    const song = Codec.Song.encode(state.song.playing)
    await httpPost('/api/channel/finished',
      song.songId ? song : null
    )
  }

  api.sendDownvote = async () => {
    const state = getState()
    if (!state.channel.name) return
    const song = Codec.Song.encode(state.song.playing)
    await httpPost('/api/channel/downVote',
      song.songId ? song : null
    )
  }

  api.sendSearch = async () => {
    const state = getState()
    const keyword = state.search.keyword
    if (keyword) {
      const data = await httpPost('/provider/searchSongs', {
        key: keyword,
        withCookie: state.user.preferences.cookie
      })
      const results = data.map(Codec.Song.decode)
      dispatch(Action.Search.results.create(results))
    } else {
      dispatch(Action.Search.results.create([]))
    }
  }

  api.receiveMessage = callback => {
    Platform.Network.websocket('/api/ws', (connect, ping) => {
      let interval
      return (event, data) => {
        const state = getState()
        switch (event) {
          case 'open': {
            interval = Platform.Timer.setInterval(ping, 30 * 1000)
            callback('connected')
            break
          }
          case 'close': {
            Platform.Timer.clearInterval(interval)
            if (state.misc.connection.status) {
              Platform.Timer.setTimeout(connect, 5 * 1000)
              callback('interrupted')
            } else {
              callback('disconnected')
            }
            break
          }
          case 'error': {
            break
          }
          case 'UserListUpdated': {
            const members = data.users.map(Codec.User.decode)
            dispatch(Action.Channel.members.create(members))
            break
          }
          case 'Play': {
            const song = data.song && {
              ...Codec.Song.decode(data.song),
              player: data.user || '',
              time: (Date.now() / 1000) - (data.elapsed || 0)
            }
            const downvote = !!data.downvote
            dispatch(Action.Player.reset.create({downvote}))
            dispatch(Action.Song.play.create(song))
            if (song && state.user.profile.id == data.user) {
              const maxIndex = Number.MAX_SAFE_INTEGER
              dispatch(Action.Song.move.create(song.id, maxIndex))
            }
            break
          }
          case 'Preload': {
            const song = data.song && Codec.Song.decode(data.song)
            dispatch(Action.Song.preload.create(song))
            break
          }
          case 'Notification': {
            const notification = {
              message: data.notification.message
            }
            dispatch(Action.Misc.notification.create(notification))
            break
          }
          case 'Disconnect': {
            const connection = {
              status: false,
              message: data.cause
            }
            dispatch(Action.Misc.connection.create(connection))
            break
          }
        }
      }
    })
  }

  return api
}
