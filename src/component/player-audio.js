import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'
import {Action, Selector} from 'wukong-client'

import style from './player-audio.css'

function mapStateToProps(state) {
  return {
    id: state.song.playing.id,
    time: state.song.playing.time,
    file: Selector.playingFile(state).url,
    volume: state.player.volume,
    reload: state.player.reload
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchRunning(running) {
      dispatch(Action.Player.running.create(running))
    },
    dispatchElapsed(elapsed) {
      dispatch(Action.Player.elapsed.create(elapsed))
    },
    dispatchDuration(duration) {
      dispatch(Action.Player.duration.create(duration))
    },
    dispatchEnded() {
      dispatch(Action.Player.ended.create())
    },
    dispatchReloaded() {
      dispatch(Action.Player.reload.create(false))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class PlayerAudio extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    time: PropTypes.number,
    file: PropTypes.string,
    volume: PropTypes.number,
    reload: PropTypes.bool,
    dispatchRunning: PropTypes.func,
    dispatchElapsed: PropTypes.func,
    dispatchDuration: PropTypes.func,
    dispatchEnded: PropTypes.func,
    dispatchReloaded: PropTypes.func
  }

  setAudioState(url, time) {
    if (url) {
      this.audio.src = url
      if (time) this.audio.currentTime = (Date.now() / 1000) - time
      this.audio.play()
    } else {
      this.audio.removeAttribute('src')
    }
  }

  onAudioEvent = (event) => {
    switch (event.type) {
      case 'playing':
        this.props.dispatchRunning(true)
        break
      case 'pause':
        this.props.dispatchRunning(false)
        break
      case 'timeupdate':
        this.props.dispatchElapsed(this.audio.currentTime)
        this.props.dispatchDuration(this.audio.duration)
        break
      case 'ended':
        this.setAudioState(null)
        this.props.dispatchEnded()
        break
      case 'error':
        this.setAudioState(null)
        this.setAudioState(this.props.file, this.props.time)
        break
    }
  }

  componentDidMount() {
    for (const type of [
      'playing', 'pause', 'timeupdate', 'ended', 'error'
    ]) this.audio.addEventListener(type, this.onAudioEvent)
    this.audio.volume = this.props.volume
    this.setAudioState(this.props.file, this.props.time)
  }

  componentWillUnmount() {
    for (const type of [
      'playing', 'pause', 'timeupdate', 'ended', 'error'
    ]) this.audio.removeEventListener(type, this.onAudioEvent)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.volume != nextProps.volume) {
      this.audio.volume = nextProps.volume
    }
    if (nextProps.reload) {
      this.setAudioState(null)
      this.setAudioState(nextProps.file, nextProps.time)
      nextProps.dispatchReloaded()
    } else if (this.props.id != nextProps.id
      || Math.abs(this.props.time - nextProps.time) > 10) {
      this.setAudioState(nextProps.file, nextProps.time)
    }
    return false
  }

  render() {
    return (
      <div styleName='container'>
        <audio ref={element => this.audio = element}
          autoPlay={true}/>
      </div>
    )
  }
}
