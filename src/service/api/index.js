import {isEqual} from 'lodash'

import Action from '../../action'
import {http, websocket} from './network'
import Codec from './codec'

export default function API(getState, dispatch, next) {
  return {
    async fetchUser() {
      const user = await http('GET', '/api/user/userinfo')
      next(Action.User.profile.create(
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
      next(Action.Song.assign.create(
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
      const channel = state.channel.name
      if (!channel) return
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
      await http('POST', `/api/channel/updateNextSong/${channel}`, {
        ...song,
        withCookie: state.user.preferences.cookie
      })
    },

    async sendSync() {
      const state = getState()
      const channel = state.channel.name
      if (!channel) return
      const song = Codec.Song.encode(state.song.playing)
      await http('POST', `/api/channel/finished/${channel}`,
        song.songId ? song : null
      )
    },

    async sendDownvote() {
      const state = getState()
      const channel = state.channel.name
      if (!channel) return
      const song = Codec.Song.encode(state.song.playing)
      await http('POST', `/api/channel/downVote/${channel}`,
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
        next(Action.Search.results.create(
          results.map(Codec.Song.decode)
        ))
      } else {
        next(Action.Search.results.create([]))
      }
    },

    receiveMessage(callback) {
      websocket('/api/ws', ({connect, send}) => async (event, data) => {
        switch (event) {
          case 'open':
            callback(event)
            break
          case 'close':
            setTimeout(connect, 5000)
            callback(event)
            break
          case 'error':
            callback(event)
            break
          case 'UserListUpdated':
            next(Action.Channel.members.create(
              data.users.map(Codec.User.decode)
            ))
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
      })
    }
  }
}
