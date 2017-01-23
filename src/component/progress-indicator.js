import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import style from './progress-indicator.css'

function mapStateToProps(state) {
  return {
    elapsed: state.player.elapsed,
    duration: state.player.duration
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class ProgressIndicator extends PureComponent {
  static propTypes = {
    elapsed: PropTypes.number,
    duration: PropTypes.number
  }

  render() {
    const {elapsed, duration} = this.props
    const formatTime = time =>
      Math.floor(time / 60) + ':' + ('00' + Math.floor(time % 60)).substr(-2)
    return (
      <div styleName='container'>
        <span>{formatTime(elapsed)}</span>
        <input type='range' readOnly={true} disabled={true}
          min={0} max={duration} step={0.1} value={elapsed}/>
        <span>-{formatTime(duration - elapsed)}</span>
      </div>
    )
  }
}
