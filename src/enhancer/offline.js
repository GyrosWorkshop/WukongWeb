import * as OfflinePlugin from 'offline-plugin/runtime'

import {Action} from '../client'

export default (createStore) => (reducer, initialState, enhancer) => {
  const store = createStore(reducer, initialState, enhancer)
  OfflinePlugin.install({
    onUpdateReady() {
      store.dispatch(Action.Misc.notification.create({
        message: 'Wukong has been updated. Reload to use the new version.',
        action: 'Reload',
        callback() {
          OfflinePlugin.applyUpdate()
        }
      }))
    },
    onUpdated() {
      location.reload(true)
    }
  })
  return store
}
