import {isEqual} from 'lodash'

import Action from '../../action'
import Network from './network'
import Codec from './codec'

export default function API(getState, dispatch) {
  const {http, websocket} = Network(
    response => {
      if (response.status == 401) {
        dispatch(Action.User.auth.create({
          state: false
        }))
        throw new Error('You have to sign in to continue.')
      }
      if (!response.ok) {
        throw new Error(`${response.statusText}: ${method} ${endpoint}`)
      }
    }
  )

  return {
    async fetchUser() {
      const user = await http('GET', '/api/user/userinfo')
      dispatch(Action.User.profile.create(
        Codec.User.decode(user)
      ))
    },

    async fetchPlaylist() {
      const state = getState()
      const sync = state.user.preferences.sync
      if (!sync) return
      const urls = sync.split('\n').filter(line => line)
      if (!urls.length) return
      const lists = await Promise.all(urls.map(url =>
        http('POST', '/provider/songListWithUrl', {
          url,
          withCookie: state.user.preferences.cookie
        })
      ))
      const songs = [].concat(...lists.map(list => list.songs || []))
      dispatch(Action.Song.assign.create(
        songs.map(Codec.Song.decode)
      ))
    },

    async sendChannel(prevState) {
      const state = getState()
      const channel = state.channel.name
      if (!channel) return
      const prevChannel = prevState && prevState.channel.name
      if (channel == prevChannel) return
      await http('POST', `/api/channel/join/${channel}`)
    },

    async sendUpnext(prevState) {
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
      await http('POST', '/api/channel/updateNextSong', {
        ...song,
        withCookie: state.user.preferences.cookie
      })
    },

    async sendEnded() {
      const state = getState()
      if (!state.channel.name) return
      const song = Codec.Song.encode(state.song.playing)
      await http('POST', '/api/channel/finished',
        song.songId ? song : null
      )
    },

    async sendDownvote() {
      const state = getState()
      if (!state.channel.name) return
      const song = Codec.Song.encode(state.song.playing)
      await http('POST', '/api/channel/downVote',
        song.songId ? song : null
      )
    },

    async sendSearch() {
      const state = getState()
      const keyword = state.search.keyword
      if (keyword) {
        const results = await http('POST', '/provider/searchSongs', {
          key: keyword,
          withCookie: state.user.preferences.cookie
        })
        dispatch(Action.Search.results.create(
          results.map(Codec.Song.decode)
        ))
      } else {
        dispatch(Action.Search.results.create([]))
      }
    },

    receiveMessage(callback) {
      websocket('/api/ws', async (event, data) => {
        switch (event) {
          case 'open':
          case 'close':
          case 'error':
            callback(event)
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
  }
}
