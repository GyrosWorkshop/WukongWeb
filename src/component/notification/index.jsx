import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Snackbar from 'material-ui/Snackbar'

import Action from '../../action'

function mapStateToProps(state) {
  return {
    notification: state.misc.notification
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onNotify(notification) {
      dispatch(Action.Misc.notification.create(notification))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SongList extends Component {
  static propTypes = {
    notification: PropTypes.object,
    onNotify: PropTypes.func
  }

  onAction = (event) => {
    this.props.notification.callback()
    this.onDismiss()
  }

  onDismiss = (event) => {
    this.props.onNotify({})
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state != nextState
      || this.props.notification.message != nextProps.notification.message
      || this.props.notification.action != nextProps.notification.action
      || this.props.notification.callback != nextProps.notification.callback
  }

  render() {
    return (
      <Snackbar
        open={!!this.props.notification.message}
        message={this.props.notification.message || ''}
        action={this.props.notification.action}
        autoHideDuration={this.props.notification.action ? 0 : 4000}
        onActionTouchTap={this.onAction}
        onRequestClose={this.onDismiss}
      />
    )
  }

  generateStyle() {
    return {}
  }
}
