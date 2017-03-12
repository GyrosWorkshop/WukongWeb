import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import Action from '../action'
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

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class Notification extends PureComponent {
  static propTypes = {
    notification: PropTypes.object,
    dispatchClearNotification: PropTypes.func
  }

  updateTimeout() {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(this.props.dispatchClearNotification,
      this.props.notification.timeout || 4000)
  }

  componentDidMount() {
    this.updateTimeout()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.notification != prevProps.notification) {
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
