import {merge, omit} from 'lodash'

const kStorageKey = 'wukong'

export default function Storage() {
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
        song: {
          playlist: state.song.playlist.map(song => omit(song, [
            'file', 'lyrics'
          ]))
        }
      }
      localStorage.setItem(kStorageKey, JSON.stringify(state))
    } catch (error) {
      localStorage.removeItem(kStorageKey)
    }
  }

  return (createStore) => (reducer, initialState, enhancer) => {
    const store = createStore(reducer, open(merge({
      user: {
        preferences: {
          listenOnly: false,
          connection: 0,
          theme: 0
        }
      }
    }, initialState)), enhancer)
    store.subscribe(() => save(store.getState()))
    return store
  }
}
