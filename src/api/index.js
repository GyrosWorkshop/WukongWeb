import 'whatwg-fetch'

import {isEqual} from 'lodash'

import Action from '../action'
import Codec from './codec'

export default function API() {
  return store => next => {
    const api = (() => {
      const app = `${location.protocol}//${location.host}`
      const server = __env.production ? app : (
        __env.server || 'http://localhost:5000'
      )
      const http = async (method, endpoint, data) => {
        const response = await fetch(`${server}${endpoint}`, {
          method,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
          mode: __env.production ? 'same-origin' : 'cors',
          credentials: __env.production ? 'same-origin' : 'include',
          cache: 'default',
          redirect: 'manual',
          referrer: 'no-referrer'
        })
        if (response.ok) {
          const data = await response.text()
          if (data) {
            return JSON.parse(data)
          }
        } else if (response.status == 401) {
          location.href = `${server}/oauth/google?redirectUri=${
            encodeURIComponent(app)
          }`
        } else {
          throw new Error(`${method} ${endpoint}: ${response.statusText}`)
        }
      }
      const websocket = (handler) => {
        const socket = new WebSocket(server.replace(/^http/i, 'ws'))
        const emit = handler({
          send(data) {
            socket.send(JSON.stringify(data))
          }
        })
        socket.onclose = event => setTimeout(() => websocket(handler), 5000)
        socket.onerror = event => {
          throw new Error('WebSocket failed')
        }
        socket.onopen = event => {
          emit('ready', event)
        }
        socket.onmessage = event => {
          if (event.data) {
            const {eventName, ...eventData} = JSON.parse(event.data)
            emit(eventName, eventData)
          }
        }
      }
      return {http, websocket}
    })()

    const fetchUser = async (state) => {
      const user = await api.http('GET', '/api/user/userinfo')
      next(Action.User.profile.create(
        Codec.User.decode(user)
      ))
    }
    const fetchPlaylist = async (state) => {
      const url = state && state.user.sync
      if (!url) return
      const list = await api.http('POST', '/provider/songListWithUrl', {
        url
      })
      if (!list || !list.songs) return
      next(Action.Song.assign.create(
        list.songs.map(Codec.Song.decode)
      ))
    }
    const sendChannel = async (state, prevState) => {
      const channel = state && state.user.channel
      if (!channel) return
      const prevChannel = prevState && prevState.user.channel
      if (channel == prevChannel) return
      await api.http('POST', `/api/channel/join/${channel}`)
    }
    const sendUpnext = async (state, prevState) => {
      const channel = state && state.user.channel
      if (!channel) return
      const song = Codec.Song.encode(
        state && (
          state.user.listenOnly
            ? undefined : state.song.playlist[0]
        )
      )
      const prevSong = Codec.Song.encode(
        prevState && (
          prevState.user.listenOnly
            ? undefined : prevState.song.playlist[0]
        )
      )
      if (prevState && isEqual(song, prevSong)) return
      await api.http('POST', `/api/channel/updateNextSong/${channel}`,
        song.songId ? song : null
      )
    }
    const sendSync = async (state, prevState) => {
      const channel = state && state.user.channel
      if (!channel) return
      const song = Codec.Song.encode(
        state && state.song.playing
      )
      await api.http('POST', `/api/channel/finished/${channel}`,
        song.songId ? song : null
      )
    }
    const sendDownvote = async (state, prevState) => {
      const channel = state && state.user.channel
      if (!channel) return
      const song = Codec.Song.encode(
        state && state.song.playing
      )
      await api.http('POST', `/api/channel/downVote/${channel}`,
        song.songId ? song : null
      )
    }
    const sendSearch = async (state, prevState) => {
      const keyword = state && state.search.keyword
      if (keyword) {
        const results = await api.http('POST', '/api/song/search', {
          key: keyword
        })
        next(Action.Search.results.create(
          results.map(Codec.Song.decode)
        ))
      } else {
        next(Action.Search.results.create([]))
      }
    }

    (async () => {
      await fetchUser()
      const state = store.getState()
      await sendChannel(state)
      api.websocket(({send}) => (event, data) => {
        switch (event) {
          case 'ready':
            sendUpnext(state)
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
            if (data.downvote) {
              next(Action.Song.downvote.create())
            }
            break
          case 'NextSongUpdate':
            next(Action.Song.preload.create(data.song && {
              ...Codec.Song.decode(data.song)
            }))
            break
        }
      })
    })()

    return async action => {
      const prevState = store.getState()
      next(action)
      const state = store.getState()

      switch (action.type) {
        case Action.User.profile.type:
          await sendChannel(state, prevState)
          await sendUpnext(state)
          break
        case Action.User.sync.type:
          await fetchPlaylist(state)
          break
        case Action.Song.prepend.type:
        case Action.Song.append.type:
        case Action.Song.remove.type:
        case Action.Song.move.type:
        case Action.Song.assign.type:
          await sendUpnext(state, prevState)
          break
        case Action.Song.ended.type:
          await sendSync(state, prevState)
          break
        case Action.Song.downvote.type:
          await sendDownvote(state, prevState)
          break
        case Action.Search.keyword.type:
          await sendSearch(state, prevState)
          break
      }
    }
  }
}
