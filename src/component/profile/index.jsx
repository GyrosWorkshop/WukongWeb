import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import Toggle from 'material-ui/Toggle'
import FlatButton from 'material-ui/FlatButton'
import muiThemeable from 'material-ui/styles/muiThemeable'

import Action from '../../action'

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onProfileUpdate(profile) {
      dispatch(Action.User.profile.create(profile))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@muiThemeable()
export default class Profile extends Component {
  static propTypes = {
    user: PropTypes.object,
    openManually: PropTypes.bool,
    onProfileUpdate: PropTypes.func,
    onRequestClose: PropTypes.func,
    muiTheme: PropTypes.object.isRequired
  }

  isOpenRequired() {
    return !this.props.user.channel
  }

  onConfirm = (event) => {
    this.props.onProfileUpdate({
      sync: this.refs.sync.input.value,
      channel: this.refs.channel.input.value,
      listenOnly: this.refs.listenOnly.state.switched,
      fileIndex: this.refs.fileIndex.state.switched ? 1 : 0
    })
    this.props.onRequestClose('confirm')
  }

  onCancel = (event) => {
    this.props.onRequestClose('cancel')
  }

  render() {
    const style = this.generateStyle()
    return (
      <Dialog
        contentStyle={style.dialog}
        title={this.props.openManually ? 'Profile' : 'Welcome'}
        actions={this.props.openManually ? [
          <FlatButton
            label='Cancel'
            primary={true}
            onTouchTap={this.onCancel}
          />,
          <FlatButton
            label='OK'
            primary={true}
            onTouchTap={this.onConfirm}
          />
        ] : [
          <FlatButton
            label='Go'
            primary={true}
            onTouchTap={this.onConfirm}
          />
        ]}
        autoScrollBodyContent={true}
        open={this.isOpenRequired() || this.props.openManually}
        onRequestClose={this.onCancel}
      >
        <TextField
          floatingLabelText='Email'
          fullWidth={true}
          value={this.props.user.email}
          disabled={true}
        />
        <TextField
          floatingLabelText='Nickname'
          fullWidth={true}
          value={this.props.user.nickname}
          disabled={true}
        />
        <TextField
          floatingLabelText='Sync'
          fullWidth={true}
          defaultValue={this.props.user.sync}
          hintText='Bring your playlist.'
          ref='sync'
        />
        <TextField
          floatingLabelText='Channel'
          fullWidth={true}
          defaultValue={this.props.user.channel}
          hintText='With your friends!'
          ref='channel'
        />
        <Toggle
          style={style.toggle}
          label='Listen Only'
          defaultToggled={this.props.user.listenOnly}
          ref='listenOnly'
        />
        <Toggle
          style={style.toggle}
          label='Use CDN'
          defaultToggled={this.props.user.fileIndex > 0}
          ref='fileIndex'
        />
      </Dialog>
    )
  }

  generateStyle() {
    return {
      dialog: {
        maxWidth: this.props.muiTheme.dialog.recommendedWidth
      },
      toggle: {
        marginTop: this.props.muiTheme.spacing.desktopGutterLess
      }
    }
  }
}
