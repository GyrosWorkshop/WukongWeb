import {merge, pick, isEqual} from 'lodash'

const key = 'wukong'
const data = {
  open: {
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
  },
  save: {}
}

export function open(state = {}) {
  try {
    return merge(data.open, JSON.parse(localStorage.getItem(key)), state)
  } catch (error) {
    return state
  }
}

export function save(state = {}) {
  try {
    const data = pick(state, [
      'user.preferences',
      'song.playlist',
      'player.volume'
    ])
    if (isEqual(data, data.save)) return
    localStorage.setItem(key, JSON.stringify(data))
    data.save = data
  } catch (error) {
    localStorage.removeItem(key)
  }
}
