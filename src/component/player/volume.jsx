import React, {Component, PropTypes} from 'react'
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
    let value = this.state.value ? 0 : this.state.lastValue
    this.setState({value})
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
          <IconButton
            touchRippleColor={this.props.muiTheme.appBar.textColor}
            onTouchTap={this.onVolumeMute}
            style={style.mute}
          >
            <VolumeMuteIcon color={this.props.muiTheme.appBar.color} />
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
    return {
      slider: {
        display: 'inline-block',
        width: this.props.muiTheme.slider.recommendedWidth,
        marginTop: 0,
        marginRight: this.props.muiTheme.slider.handleSizeActive,
        marginBottom: 3,
        marginLeft: 0
      },
      sliderInner: {
        margin: 0
      },
      mute: {
        width: 'auto',
        paddingRight: 5
      }
    }
  }
}
