import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'

import {Action} from '../client'
import style from './volume-slider.css'

function mapStateToProps(state) {
  return {
    volume: state.player.volume
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchVolume(volume) {
      dispatch(Action.Player.volume.create(volume))
    }
  }
}

export default
@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
class VolumeSlider extends PureComponent {
  static propTypes = {
    volume: PropTypes.number,
    dispatchVolume: PropTypes.func
  }

  state = {
    canSetVolume: (() => {
      const audio = document.createElement('audio')
      audio.volume = 0
      return audio.volume == 0
    })()
  }

  onInputChange = (event) => {
    const input = parseFloat(event.target.value)
    this.props.dispatchVolume(input)
  }

  onDownButtonClick = (event) => {
    this.props.dispatchVolume(Math.max(0, this.props.volume - 1 / 16))
  }

  onUpButtonClick = (event) => {
    this.props.dispatchVolume(Math.min(1, this.props.volume + 1 / 16))
  }

  render() {
    const {volume} = this.props
    const {canSetVolume} = this.state
    return canSetVolume && (
      <div styleName='container'>
        <button onClick={this.onDownButtonClick}>
          <i className='fa fa-volume-down'/>
        </button>
        <input type='range' min={0} max={1} step={0.01}
          value={volume} onChange={this.onInputChange}/>
        <button onClick={this.onUpButtonClick}>
          <i className='fa fa-volume-up'/>
        </button>
      </div>
    )
  }
}
