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
        onActionTouchTap={this.props.notification.callback}
        onRequestClose={this.onDismiss}
        autoHideDuration={4000}
      />
    )
  }

  generateStyle() {
    return {}
  }
}
