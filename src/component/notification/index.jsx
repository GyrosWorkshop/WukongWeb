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

  render() {
    return (
      <Snackbar
        open={!!this.props.notification.message}
        message={this.props.notification.message}
        action={this.props.notification.action}
        onActionTouchTap={this.props.notification.callback}
        onRequestClose={this.onDismiss}
        autoHideDuration={this.props.notification.action ? 0 : 4000}
      />
    )
  }

  generateStyle() {
    return {}
  }
}
