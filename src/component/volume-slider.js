import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import Action from '../action'
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

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class VolumeSlider extends PureComponent {
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

  onMinButtonClick = (event) => {
    this.props.dispatchVolume(0)
  }

  onMaxButtonClick = (event) => {
    this.props.dispatchVolume(1)
  }

  render() {
    const {volume} = this.props
    const {canSetVolume} = this.state
    return canSetVolume && (
      <div styleName='container'>
        <button onClick={this.onMinButtonClick}>
          <i className='fa fa-volume-down'/>
        </button>
        <input type='range' min={0} max={1} step={0.01}
          value={volume} onChange={this.onInputChange}/>
        <button onClick={this.onMaxButtonClick}>
          <i className='fa fa-volume-up'/>
        </button>
      </div>
    )
  }
}
