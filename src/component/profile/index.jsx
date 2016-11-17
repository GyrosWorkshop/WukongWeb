import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import Toggle from 'material-ui/Toggle'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
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
      channel: this.refs.channel.getValue(),
      sync: this.refs.sync.getValue(),
      withCookie: this.refs.withCookie.getValue(),
      listenOnly: this.refs.listenOnly.isToggled(),
      connection: this.refs.connection.isToggled() ? 1 : 0
    })
    this.props.onRequestClose('confirm')
  }

  onCancel = (event) => {
    this.props.onRequestClose('cancel')
  }

  onThemeChange = (event, index, value) => {
    this.props.onProfileUpdate({theme: value})
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
          floatingLabelText='Channel'
          fullWidth={true}
          defaultValue={this.props.user.channel}
          hintText='With your friends!'
          ref='channel'
        />
        <TextField
          floatingLabelText='Sync'
          fullWidth={true}
          multiLine={true}
          rows={1}
          rowsMax={3}
          defaultValue={this.props.user.sync}
          hintText='Bring your playlist.'
          ref='sync'
        />
        <TextField
          floatingLabelText='Upstream Cookie'
          fullWidth={true}
          multiLine={true}
          rows={1}
          rowsMax={3}
          defaultValue={this.props.user.withCookie}
          hintText='Cookie used to be sent to upstream sites by the provider.'
          ref='withCookie'
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
          defaultToggled={this.props.user.connection > 0}
          ref='connection'
        />
        <SelectField
          floatingLabelText='Theme'
          fullWidth={true}
          value={this.props.user.theme}
          onChange={this.onThemeChange}
        >
          <MenuItem value={0} primaryText='Wukong' />
          <MenuItem value={1} primaryText='Material' />
          <MenuItem value={2} primaryText='Night' />
        </SelectField>
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
