import Action from '../../action'

export default function Utility(getState, dispatch) {
  return {
    notifyError(error, action, callback) {
      dispatch(Action.Misc.notification.create({
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
