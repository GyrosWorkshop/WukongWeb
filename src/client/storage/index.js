import Database from './database'

export default function Storage(Platform) {
  return (createStore) => (reducer, initialState, enhancer) => {
    const database = Database(Platform)
    const store = createStore(reducer, database.open(initialState), enhancer)
    store.subscribe(() => database.save(store.getState()))
    return store
  }
}
