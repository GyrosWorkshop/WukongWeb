import {merge, pick} from 'lodash'

const kStorageKey = 'wukong'

export function open(state = {}) {
  try {
    return merge({
      user: {
        preferences: {
          listenOnly: false,
          connection: 0,
          audioQuality: 0,
          theme: 0
        }
      }
    }, JSON.parse(localStorage.getItem(kStorageKey)), state)
  } catch (error) {
    return state
  }
}

export function save(state = {}) {
  try {
    localStorage.setItem(kStorageKey, JSON.stringify(pick(state, [
      'user.preferences',
      'channel.name',
      'song.playlist',
      'player.volume'
    ])))
  } catch (error) {
    localStorage.removeItem(kStorageKey)
  }
}