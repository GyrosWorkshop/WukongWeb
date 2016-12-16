import {merge, omit} from 'lodash'

const kStorageKey = 'wukong'

export function open(state = {}) {
  try {
    return merge(state, JSON.parse(localStorage.getItem(kStorageKey)))
  } catch (error) {
    return state
  }
}

export function save(state = {}) {
  try {
    state = {
      user: {
        preferences: state.user.preferences
      },
      channel: {
        name: state.channel.name
      },
      song: {
        playlist: state.song.playlist.map(song => omit(song, [
          'file', 'lyrics'
        ]))
      },
      player: {
        volume: state.player.volume
      }
    }
    localStorage.setItem(kStorageKey, JSON.stringify(state))
  } catch (error) {
    localStorage.removeItem(kStorageKey)
  }
}
