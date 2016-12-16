import Action from '../../action'

export default function Utility(getState, dispatch, next) {
  return {
    notifyError(error, action, callback) {
      next(Action.Misc.notification.create({
        message: error.toString(),
        action,
        callback
      }))
    },

    reloadApp() {
      location.reload(true)
    }
  }
}
