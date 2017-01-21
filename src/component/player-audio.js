import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import Selector from '../selector'
import Action from '../action'
import style from './player-audio.css'

function mapStateToProps(state) {
  return {
    playing: Selector.playingFile(state).url,
    preload: Selector.preloadFile(state).url,
    song: state.song.playing.id,
    time: state.song.playing.time,
    running: state.player.running,
    volume: state.player.volume,
    reload: state.player.reload,
    isSelf: Selector.selfPlaying(state)
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
    },
    dispatchSelfPlaying() {
      dispatch(Action.Song.move.create(0, Number.MAX_SAFE_INTEGER))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class PlayerAudio extends PureComponent {
  static propTypes = {
    playing: PropTypes.string,
    preload: PropTypes.string,
    song: PropTypes.string,
    time: PropTypes.number,
    running: PropTypes.bool,
    volume: PropTypes.number,
    reload: PropTypes.bool,
    isSelf: PropTypes.bool,
    dispatchRunning: PropTypes.func,
    dispatchElapsed: PropTypes.func,
    dispatchDuration: PropTypes.func,
    dispatchEnded: PropTypes.func,
    dispatchReloaded: PropTypes.func,
    dispatchSelfPlaying: PropTypes.func
  }

  setAudioState(audio, url, time) {
    if (url) {
      audio.src = url
      if (time) audio.currentTime = (Date.now() / 1000) - time
    } else {
      audio.removeAttribute('src')
    }
  }

  onAudioEvent = (event) => {
    const {playing} = this.refs
    switch (event.type) {
      case 'playing':
        this.props.dispatchRunning(true)
        break
      case 'pause':
        this.props.dispatchRunning(false)
        break
      case 'timeupdate':
        this.props.dispatchElapsed(playing.currentTime)
        this.props.dispatchDuration(playing.duration)
        break
      case 'ended':
        this.setAudioState(playing, null)
        this.props.dispatchEnded()
        break
      case 'error':
        this.setAudioState(playing, null)
        break
    }
  }

  componentDidMount() {
    const {playing} = this.refs
    for (const type of [
      'playing', 'pause', 'timeupdate', 'ended', 'error'
    ]) playing.addEventListener(type, this.onAudioEvent)
    playing.volume = this.props.volume
    this.setAudioState(playing, this.props.playing, this.props.time)
  }

  componentWillUnmount() {
    const {playing} = this.refs
    for (const type of [
      'playing', 'pause', 'timeupdate', 'ended', 'error'
    ]) playing.removeEventListener(type, this.onAudioEvent)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {playing, preload} = this.refs
    if (this.props.volume != nextProps.volume) {
      playing.volume = nextProps.volume
    }
    if (nextProps.reload) {
      this.setAudioState(playing, null)
      this.setAudioState(playing, nextProps.playing, nextProps.time)
      nextProps.dispatchReloaded()
    } else if (this.props.song != nextProps.song
      || Math.abs(this.props.time - nextProps.time) > 10) {
      this.setAudioState(playing, nextProps.playing, nextProps.time)
      if (nextProps.isSelf) {
        nextProps.dispatchSelfPlaying()
      }
    }
    if (this.props.preload != nextProps.preload) {
      this.setAudioState(preload, nextProps.preload)
    }
    return false
  }

  render() {
    return (
      <div styleName='container'>
        <audio ref='playing' autoPlay={true}/>
        <audio ref='preload' preload='auto'/>
      </div>
    )
  }
}
