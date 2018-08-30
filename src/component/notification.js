import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'

import {Action} from '../client'
import style from './notification.css'

function mapStateToProps(state) {
  return {
    notification: state.misc.notification
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchClearNotification() {
      dispatch(Action.Misc.notification.create({}))
    }
  }
}

export default
@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
class Notification extends PureComponent {
  static propTypes = {
    notification: PropTypes.object,
    dispatchClearNotification: PropTypes.func
  }

  updateTimeout() {
    clearTimeout(this.timeout)
    if (!this.props.notification.action) {
      this.timeout = setTimeout(this.props.dispatchClearNotification, 4000)
    }
  }

  componentDidMount() {
    this.updateTimeout()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.notification.message != prevProps.notification.message
      && this.props.notification.action != prevProps.notification.action) {
      this.updateTimeout()
    }
  }

  onButtonClick = (event) => {
    const {callback} = this.props.notification
    if (callback) {
      callback()
    } else {
      this.props.dispatchClearNotification()
    }
  }

  render() {
    const {message, action} = this.props.notification
    return message && (
      <div styleName='container'>
        <p>{message}</p>
        <button onClick={this.onButtonClick}>
          {action || 'Dismiss'}
        </button>
      </div>
    )
  }
}
