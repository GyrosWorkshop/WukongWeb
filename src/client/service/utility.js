import Action from '../action'

export default function Utility(Platform, getState, dispatch) {
  const utility = {}

  utility.notifyError = (error, action, callback) => {
    dispatch(Action.Misc.notification.create({
      message: error.toString(),
      action,
      callback
    }))
  }

  utility.reloadApp = () => {
    Platform.App.reload()
  }

  return utility
}
