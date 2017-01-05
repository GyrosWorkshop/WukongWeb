import {merge, pick} from 'lodash'

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
    state = pick(state, [
      'user.preferences',
      'channel.name',
      'song.playlist',
      'player.volume'
    ])
    localStorage.setItem(kStorageKey, JSON.stringify(state))
  } catch (error) {
    localStorage.removeItem(kStorageKey)
  }
}
