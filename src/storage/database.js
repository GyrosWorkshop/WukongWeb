import {merge, pick} from 'lodash'

const key = 'wukong'

export function open(state = {}) {
  try {
    return merge({
      user: {
        auth: {
          status: true
        },
        preferences: {
          listenOnly: false,
          connection: 0,
          audioQuality: 2
        }
      }
    }, JSON.parse(localStorage.getItem(key)), state)
  } catch (error) {
    return state
  }
}

export function save(state = {}) {
  try {
    localStorage.setItem(key, JSON.stringify(pick(state, [
      'user.preferences',
      'song.playlist',
      'player.volume'
    ])))
  } catch (error) {
    localStorage.removeItem(key)
  }
}
