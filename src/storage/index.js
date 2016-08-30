import {omit} from 'lodash'

const kStorageKey = 'wukong'

export default function Storage() {
  const open = (state = {}) => {
    try {
      state = {
        ...state,
        ...JSON.parse(localStorage.getItem(kStorageKey))
      }
      const channel = location.hash.replace(/^#/, '')
      if (channel) {
        state.user = {
          ...state.user,
          channel
        }
      }
      return state
    } catch (error) {
      return state
    }
  }
  const save = (state = {}) => {
    try {
      state = {
        user: state.user,
        song: {
          playlist: state.song.playlist.map(song => omit(song, 'lyrics'))
        }
      }
      localStorage.setItem(kStorageKey, JSON.stringify(state))
      location.hash = state.user.channel || ''
    } catch (error) {
      localStorage.removeItem(kStorageKey)
      location.hash = ''
    }
  }

  return (createStore) => (reducer, initialState, enhancer) => {
    const store = createStore(reducer, open(initialState), enhancer)
    store.subscribe(() => save(store.getState()))
    return store
  }
}
