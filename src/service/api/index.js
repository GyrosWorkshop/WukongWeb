import {isEqual} from 'lodash'

import Action from '../../action'
import Network from './network'
import Codec from './codec'

export default function API(getState, dispatch) {
  const network = Network(
    (method, endpoint, response) => {
      if (response.status == 401) {
        dispatch(Action.User.auth.create({
          status: false
        }))
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
      const providers = await network.http('GET', '/oauth/all')
      dispatch(Action.User.auth.create({
        providers: providers.map(provider => ({
          id: provider.scheme,
          name: provider.displayName,
          url: provider.url
        }))
      }))
    }
  }

  api.fetchUser = async () => {
    const user = await network.http('GET', '/api/user/userinfo')
    dispatch(Action.User.profile.create(
      Codec.User.decode(user)
    ))
  }

  api.fetchUserConfiguration = async () => {
    const configuration = await network.http('GET', '/api/user/configuration')
    if (configuration.syncPlaylists && configuration.cookies) {
      dispatch(Action.User.preferences.create(
        Codec.UserConfiguration.decode(configuration)
      ))
    }
  }

  api.saveUserConfiguration = async() => {
    const state = getState()
    const configuration = Codec.UserConfiguration.encode(state.user.preferences)
    await network.http('POST', '/api/user/configuration', configuration)
  }

  api.fetchPlaylist = async () => {
    const state = getState()
    const sync = state.user.preferences.sync
    if (!sync) return
    const urls = sync.split('\n').filter(line => line)
    if (!urls.length) return
    const lists = await Promise.all(urls.map(url =>
      network.http('POST', '/provider/songListWithUrl', {
        url,
        withCookie: state.user.preferences.cookie
      })
    ))
    const songs = [].concat(...lists.map(list => list.songs || []))
    dispatch(Action.Song.assign.create(
      songs.map(Codec.Song.decode)
    ))
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
    const prevSong = Codec.Song.encode(prevState && (
        prevState.user.preferences.listenOnly
          ? undefined
          : prevState.song.playlist[0]
      ))
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
      const results = await network.http('POST', '/provider/searchSongs', {
        key: keyword,
        withCookie: state.user.preferences.cookie
      })
      dispatch(Action.Search.results.create(
        results.map(Codec.Song.decode)
      ))
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
        case 'error':
          callback(event)
          break
        case 'ping':
          send('ping')
          break
        case 'UserListUpdated':
          dispatch(Action.Channel.members.create(
            data.users.map(Codec.User.decode)
          ))
          break
        case 'Play':
          dispatch(Action.Player.reset.create({
            downvote: !!data.downvote
          }))
          dispatch(Action.Song.play.create(data.song && {
            ...Codec.Song.decode(data.song),
            player: data.user || '',
            time: (Date.now() / 1000) - (data.elapsed || 0)
          }))
          if (state.user.profile.id == data.user) {
            dispatch(Action.Song.move.create(
              Codec.Song.decode(data.song).id,
              Number.MAX_SAFE_INTEGER
            ))
          }
          break
        case 'NextSongUpdate':
          dispatch(Action.Song.preload.create(data.song && {
            ...Codec.Song.decode(data.song)
          }))
          break
        case 'Notification':
          dispatch(Action.Misc.notification.create(
            data.notification
          ))
          break
      }
    })
  }

  return api
}
