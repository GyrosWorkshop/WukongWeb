import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'
import {Action} from 'wukong-client'

import style from './disconnect-dialog.css'

function mapStateToProps(state) {
  return {
    cause: state.misc.disconnect.cause
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchReconnect() {
      dispatch(Action.Misc.disconnect.create({}))
      dispatch(Action.Misc.reconnect.create())
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class DisconnectDialog extends PureComponent {
  static propTypes = {
    cause: PropTypes.string,
    dispatchReconnect: PropTypes.func
  }

  render() {
    const {cause, dispatchReconnect} = this.props
    return cause && (
      <div styleName='container'>
        <div styleName='content'>
          <p className={style.title}>Disconnected</p>
          <p>Your account is connected on another device.</p>
          <p>Device: {cause}</p>
          <p className={style.ActionGroup}>
            <button onClick={dispatchReconnect}>Reconnect</button>
          </p>
        </div>
      </div>
    )
  }
}
