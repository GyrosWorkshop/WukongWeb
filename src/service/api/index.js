import {isEqual} from 'lodash'

import Action from '../../action'
import Network from './network'
import Codec from './codec'

export default function API(getState, dispatch) {
  const network = Network(
    (method, endpoint, response) => {
      if (response.status == 401) {
        dispatch(Action.User.auth.create({status: false}))
        throw new Error('You have to sign in to continue.')
      }
      if (!response.ok) {
        throw new Error(`${response.statusText}: ${method} ${endpoint}`)
      }
    }
  )

  const api = {}

  api.processAuth = async () => {
    const state = getState()
    const auth = state.user.auth
    if (auth.status) return
    if (auth.providers) {
      const provider = auth.providers.find(
        provider => provider.id == auth.selected
      )
      if (provider) {
        location.href = network.url('http', `${provider.url}?redirectUri=${
          encodeURIComponent(location.href)
        }`)
      }
    } else {
      const data = await network.http('GET', '/oauth/all')
      const providers = data.map(item => ({
        id: item.scheme,
        name: item.displayName,
        url: item.url
      }))
      dispatch(Action.User.auth.create({providers}))
    }
  }

  api.fetchUser = async () => {
    const data = await network.http('GET', '/api/user/userinfo')
    const profile = Codec.User.decode(data)
    dispatch(Action.User.profile.create(profile))
  }

  api.fetchPreferences = async () => {
    const data = await network.http('GET', '/api/user/configuration')
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
      network.http('POST', '/provider/songListWithUrl', {
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
    await network.http('POST', '/api/user/configuration',
      preferences
    )
  }

  api.sendChannel = async prevState => {
    const state = getState()
    const channel = state.channel.name
    if (!channel) return
    const prevChannel = prevState && prevState.channel.name
    if (channel == prevChannel) return
    await network.http('POST', `/api/channel/join/${channel}`)
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
    await network.http('POST', '/api/channel/updateNextSong', {
      ...song,
      withCookie: state.user.preferences.cookie
    })
  }

  api.sendEnded = async () => {
    const state = getState()
    if (!state.channel.name) return
    const song = Codec.Song.encode(state.song.playing)
    await network.http('POST', '/api/channel/finished',
      song.songId ? song : null
    )
  }

  api.sendDownvote = async () => {
    const state = getState()
    if (!state.channel.name) return
    const song = Codec.Song.encode(state.song.playing)
    await network.http('POST', '/api/channel/downVote',
      song.songId ? song : null
    )
  }

  api.sendSearch = async () => {
    const state = getState()
    const keyword = state.search.keyword
    if (keyword) {
      const data = await network.http('POST', '/provider/searchSongs', {
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
    network.websocket('/api/ws', send => async (event, data) => {
      const state = getState()
      switch (event) {
        case 'open':
        case 'close':
        case 'error': {
          callback(event)
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
            dispatch(Action.Song.move.create(song.id, Number.MAX_SAFE_INTEGER))
          }
          break
        }
        case 'NextSongUpdate': {
          const song = data.song && Codec.Song.decode(data.song)
          dispatch(Action.Song.preload.create(song))
          break
        }
        case 'Notification': {
          const notification = data.notification
          dispatch(Action.Misc.notification.create(notification))
          break
        }
      }
    })
  }

  return api
}
