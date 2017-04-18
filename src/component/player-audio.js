import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'

import Selector from '../selector'
import Action from '../action'
import style from './player-audio.css'

function mapStateToProps(state) {
  return {
    id: state.song.playing.id,
    file: Selector.playingFile(state).url,
    time: state.song.playing.time,
    running: state.player.running,
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
    file: PropTypes.string,
    time: PropTypes.number,
    running: PropTypes.bool,
    volume: PropTypes.number,
    reload: PropTypes.bool,
    dispatchRunning: PropTypes.func,
    dispatchElapsed: PropTypes.func,
    dispatchDuration: PropTypes.func,
    dispatchEnded: PropTypes.func,
    dispatchReloaded: PropTypes.func
  }

  setAudioState(url, time) {
    const {audio} = this.refs
    if (url) {
      audio.src = url
      if (time) audio.currentTime = (Date.now() / 1000) - time
      audio.play()
    } else {
      audio.removeAttribute('src')
    }
  }

  onAudioEvent = (event) => {
    const {audio} = this.refs
    switch (event.type) {
      case 'playing':
        this.props.dispatchRunning(true)
        break
      case 'pause':
        this.props.dispatchRunning(false)
        break
      case 'timeupdate':
        this.props.dispatchElapsed(audio.currentTime)
        this.props.dispatchDuration(audio.duration)
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
    const {audio} = this.refs
    for (const type of [
      'playing', 'pause', 'timeupdate', 'ended', 'error'
    ]) audio.addEventListener(type, this.onAudioEvent)
    audio.volume = this.props.volume
    this.setAudioState(this.props.file, this.props.time)
  }

  componentWillUnmount() {
    const {audio} = this.refs
    for (const type of [
      'playing', 'pause', 'timeupdate', 'ended', 'error'
    ]) audio.removeEventListener(type, this.onAudioEvent)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {audio} = this.refs
    if (this.props.volume != nextProps.volume) {
      audio.volume = nextProps.volume
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
        <audio ref='audio' autoPlay={true}/>
      </div>
    )
  }
}
