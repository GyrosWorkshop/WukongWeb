import {merge, omit} from 'lodash'

const kStorageKey = 'wukong'

export default function Storage() {
  const open = (state = {}) => {
    try {
      return merge(state, JSON.parse(localStorage.getItem(kStorageKey)), {
        user: {
          channel: location.hash.replace(/^#/, '') || undefined
        }
      })
    } catch (error) {
      return state
    }
  }
  const save = (state = {}) => {
    try {
      state = {
        user: state.user,
        song: {
          playlist: state.song.playlist.map(song => omit(song, [
            'file', 'lyrics'
          ]))
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
    const store = createStore(reducer, open(merge({
      user: {
        listenOnly: false,
        connection: 0,
        theme: 0,
        audioQuality: 3   // 'high'
      }
    }, initialState)), enhancer)
    store.subscribe(() => save(store.getState()))
    return store
  }
}
