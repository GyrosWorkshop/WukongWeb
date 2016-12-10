import {merge, omit} from 'lodash'

const kStorageKey = 'wukong'
const open = (state = {}) => {
  try {
    return merge(state, JSON.parse(localStorage.getItem(kStorageKey)))
  } catch (error) {
    return state
  }
}
const save = (state = {}) => {
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

export default function Storage() {
  return (createStore) => (reducer, initialState, enhancer) => {
    const store = createStore(reducer, open(initialState), enhancer)
    store.subscribe(() => save(store.getState()))
    return store
  }
}
