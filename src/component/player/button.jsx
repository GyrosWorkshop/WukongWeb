import React, {Component, PropTypes} from 'react'
import IconButton from 'material-ui/IconButton'
import muiThemeable from 'material-ui/styles/muiThemeable'

@muiThemeable()
export default class Button extends Component {
  static propTypes = {
    icon: PropTypes.func,
    disabled: PropTypes.bool,
    onAction: PropTypes.func,
    muiTheme: PropTypes.object.isRequired
  }

  render() {
    const Icon = this.props.icon
    return (
      <IconButton
        touchRippleColor={this.props.muiTheme.appBar.textColor}
        disabled={this.props.disabled}
        onTouchTap={this.props.onAction}
      >
        <Icon color={this.props.muiTheme.appBar.textColor} />
      </IconButton>
    )
  }

  generateStyle() {
    return {}
  }
}
