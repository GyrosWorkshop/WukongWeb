import Action from '../../action'

export default function Utility(getState, dispatch) {
  const utility = {}

  utility.notifyError = (error, action, callback) => {
    dispatch(Action.Misc.notification.create({
      message: error.toString(),
      action,
      callback
    }))
  }

  utility.reloadApp = () => {
    location.reload(true)
  }

  return utility
}
