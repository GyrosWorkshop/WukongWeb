import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import IconButton from 'material-ui/IconButton'
import Popover from 'material-ui/Popover'
import Slider from 'material-ui/Slider'
import VolumeUpIcon from 'material-ui/svg-icons/av/volume-up'
import VolumeDownIcon from 'material-ui/svg-icons/av/volume-down'
import VolumeMuteIcon from 'material-ui/svg-icons/av/volume-mute'
import muiThemeable from 'material-ui/styles/muiThemeable'

@muiThemeable()
export default class Volume extends Component {
  static propTypes = {
    initialValue: PropTypes.number,
    onChange: PropTypes.func,
    muiTheme: PropTypes.object.isRequired
  }

  state = {
    value: this.props.initialValue,
    level: 2,
    popover: false,
    popoverAnchor: null
  }

  getVolumeIcon() {
    return [
      VolumeMuteIcon, VolumeDownIcon, VolumeUpIcon
    ][this.state.level]
  }

  onPopoverOpen = (event) => {
    event.preventDefault()
    this.setState({popover: true, popoverAnchor: event.currentTarget})
  }

  onPopoverClose = (event) => {
    this.setState({popover: false, popoverAnchor: null})
  }

  onVolumeChange = (event, value) => {
    const level = Math.ceil(value * 2)
    this.setState({value, level})
    this.props.onChange(value)
  }

  render() {
    const AvVolume = this.getVolumeIcon()
    const style = this.generateStyle()
    return (
      <IconButton
        touchRippleColor={this.props.muiTheme.appBar.textColor}
        onTouchTap={this.onPopoverOpen}
      >
        <AvVolume color={this.props.muiTheme.appBar.textColor} />
        <Popover
          open={this.state.popover}
          anchorEl={this.state.popoverAnchor}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          onRequestClose={this.onPopoverClose}
        >
          <Slider
            style={style.slider}
            value={this.state.value}
            onChange={this.onVolumeChange}
            ref={slider => {
              const element = ReactDOM.findDOMNode(slider)
              if (element) {
                element.querySelector('div').style.margin = 0
              }
            }}
          />
        </Popover>
      </IconButton>
    )
  }

  generateStyle() {
    return {
      slider: {
        width: this.props.muiTheme.slider.recommendedWidth,
        marginTop: this.props.muiTheme.slider.handleSizeActive / 2,
        marginBottom: this.props.muiTheme.slider.handleSizeActive / 2,
        marginLeft: this.props.muiTheme.slider.handleSizeActive,
        marginRight: this.props.muiTheme.slider.handleSizeActive
      }
    }
  }
}
