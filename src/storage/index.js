import {open, save} from './database'

export default function Storage() {
  return (createStore) => (reducer, initialState, enhancer) => {
    const store = createStore(reducer, open(initialState), enhancer)
    store.subscribe(() => save(store.getState()))
    return store
  }
}
