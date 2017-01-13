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

  render() {
    return (
      <div styleName='container'>
        <i className='fa fa-volume-down'/>
        <input type='range'/>
        <i className='fa fa-volume-up'/>
      </div>
    )
  }
}
