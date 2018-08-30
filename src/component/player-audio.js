import React, {Component, createRef} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'

import {Action, Selector} from '../client'
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

export default
@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
class PlayerAudio extends Component {
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

  audio = createRef()

  setAudioState(url, time) {
    if (url) {
      this.audio.current.src = url
      if (time) this.audio.current.currentTime = (Date.now() / 1000) - time
      this.audio.current.play()
    } else {
      this.audio.current.removeAttribute('src')
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
        this.props.dispatchElapsed(this.audio.current.currentTime)
        break
      case 'durationchange':
        this.props.dispatchDuration(this.audio.current.duration)
        break
      case 'ended':
        this.setAudioState(null)
        this.props.dispatchEnded()
        break
      case 'error':
        switch (this.audio.current.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
          case MediaError.MEDIA_ERR_NETWORK:
            this.setAudioState(null)
            this.setAudioState(this.props.file, this.props.time)
            break
          case MediaError.MEDIA_ERR_DECODE:
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            break
        }
        break
    }
  }

  componentDidMount() {
    for (const type of [
      'playing', 'pause', 'timeupdate', 'durationchange', 'ended', 'error'
    ]) this.audio.current.addEventListener(type, this.onAudioEvent)
    this.audio.current.volume = this.props.volume
    this.setAudioState(this.props.file, this.props.time)
  }

  componentWillUnmount() {
    for (const type of [
      'playing', 'pause', 'timeupdate', 'durationchange', 'ended', 'error'
    ]) this.audio.current.removeEventListener(type, this.onAudioEvent)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.volume != nextProps.volume) {
      this.audio.current.volume = nextProps.volume
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
        <audio ref={this.audio}
          autoPlay={true}/>
      </div>
    )
  }
}
