import React, {Component, PropTypes} from 'react'
import IconButton from 'material-ui/IconButton'
import Popover from 'material-ui/Popover'
import Slider from 'material-ui/Slider'
import VolumeUpIcon from 'material-ui/svg-icons/av/volume-up'
import VolumeDownIcon from 'material-ui/svg-icons/av/volume-down'
import VolumeMuteIcon from 'material-ui/svg-icons/av/volume-mute'
import VolumeOffIcon from 'material-ui/svg-icons/av/volume-off'
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
    lastValue: this.props.initialValue,
    popover: false,
    popoverAnchor: null
  }

  getVolumeIcon() {
    return [
      VolumeMuteIcon, VolumeDownIcon, VolumeUpIcon
    ][Math.ceil(this.state.value * 2)]
  }

  onPopoverOpen = (event) => {
    event.preventDefault()
    this.setState({popover: true, popoverAnchor: event.currentTarget})
  }

  onPopoverClose = (event) => {
    this.setState({popover: false, popoverAnchor: null})
  }

  onVolumeChange = (event, value) => {
    this.setState({value, lastValue: value})
    this.props.onChange(value)
  }

  onVolumeMute = (event) => {
    const value = this.state.value ? 0 : this.state.lastValue
    this.setState({value})
    this.props.onChange(value)
  }

  render() {
    const VolumeIcon = this.getVolumeIcon()
    const style = this.generateStyle()
    return (
      <IconButton
        touchRippleColor={this.props.muiTheme.appBar.textColor}
        onTouchTap={this.onPopoverOpen}
      >
        <VolumeIcon color={this.props.muiTheme.appBar.textColor} />
        <Popover
          open={this.state.popover}
          anchorEl={this.state.popoverAnchor}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          onRequestClose={this.onPopoverClose}
        >
          <IconButton
            touchRippleColor={this.props.muiTheme.appBar.color}
            onTouchTap={this.onVolumeMute}
            style={style.sliderButton}
          >
            <VolumeOffIcon color={this.props.muiTheme.appBar.color} />
          </IconButton>
          <Slider
            style={style.slider}
            sliderStyle={style.sliderInner}
            value={this.state.value}
            onChange={this.onVolumeChange}
          />
        </Popover>
      </IconButton>
    )
  }

  generateStyle() {
    const fullHeight = 36
    const iconHeight = 24
    const sliderHeight = this.props.muiTheme.slider.handleSizeActive
    return {
      slider: {
        display: 'inline-block',
        width: this.props.muiTheme.slider.recommendedWidth,
        paddingTop: (iconHeight - sliderHeight) / 2,
        paddingBottom: (iconHeight - sliderHeight) / 2,
        marginLeft: 6,
        marginRight: 18
      },
      sliderInner: {
        margin: 0
      },
      sliderButton: {
        width: fullHeight,
        height: fullHeight,
        padding: (fullHeight - iconHeight) / 2,
        marginLeft: 6,
        marginRight: 0
      },
      sliderButtonIcon: {
        width: iconHeight,
        height: iconHeight
      }
    }
  }
}
