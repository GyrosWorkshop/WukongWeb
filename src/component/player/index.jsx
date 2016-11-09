import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import PlayArrowIcon from 'material-ui/svg-icons/av/play-arrow'
import ThumbDownIcon from 'material-ui/svg-icons/action/thumb-down'
import muiThemeable from 'material-ui/styles/muiThemeable'
import {debounce} from 'lodash'

import Volume from './volume'
import Button from './button'
import Action from '../../action'
import unavailableSong from '../../resource/unavailable.mp3'

const kVolumeKey = 'volume'

function mapStateToProps(state) {
  return {
    playing: state.song.playing,
    preload: state.song.preload,
    userId: state.user.id,
    connection: state.user.connection,
    downvote: state.song.status.downvote
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onPlayOwn(song) {
      dispatch(Action.Song.append.create(song))
    },
    onElapsed(elapsed) {
      dispatch(Action.Song.elapsed.create(elapsed))
    },
    onEnded() {
      dispatch(Action.Song.ended.create())
    },
    onDownvote() {
      dispatch(Action.Song.downvote.create())
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@muiThemeable()
export default class Player extends Component {
  static propTypes = {
    playing: PropTypes.object,
    preload: PropTypes.object,
    userId: PropTypes.string,
    connection: PropTypes.number,
    downvote: PropTypes.bool,
    onPlayOwn: PropTypes.func,
    onElapsed: PropTypes.func,
    onEnded: PropTypes.func,
    onDownvote: PropTypes.func,
    muiTheme: PropTypes.object.isRequired
  }

  state = {
    initialVolume: (() => {
      const volume = parseFloat(localStorage.getItem(kVolumeKey))
      return isNaN(volume) ? 0.5 : volume
    })(),
    isPlaying: false,
    canSetVolume: (() => {
      const audio = document.createElement('audio')
      audio.volume = 0
      return audio.volume == 0
    })(),
    remainingTime: 0
  }

  setAudioState(audio, file, time) {
    if (file) {
      audio.src = file[this.props.connection]
      if (time) {
        audio.currentTime = (Date.now() / 1000) - time
      }
    } else {
      audio.src = ''
    }
  }

  onAudioEvent = (event) => {
    const {playing} = this.refs
    switch (event.type) {
      case 'playing':
        this.setState({isPlaying: true})
        break
      case 'pause':
        this.setState({isPlaying: false})
        break
      case 'timeupdate':
        this.setState({remainingTime: playing.duration - playing.currentTime})
        this.props.onElapsed(playing.currentTime)
        break
      case 'ended':
        this.setAudioState(playing, null)
        this.props.onEnded()
        break
      case 'error':
        this.setAudioState(playing, null)
        break
    }
  }

  onPlayAction = (event) => {
    const {playing} = this.refs
    const {file, time} = this.props.playing
    this.setAudioState(playing, null)
    this.setAudioState(playing, file || unavailableSong, time)
    playing.play()
  }

  onDownvoteAction = (event) => {
    this.props.onDownvote()
  }

  onVolumeChange = (() => {
    const debouncedSave = debounce(value => {
      localStorage.setItem(kVolumeKey, value.toFixed(2))
    }, 1000)
    return value => {
      const {playing} = this.refs
      playing.volume = value
      debouncedSave(value)
    }
  })()

  componentDidMount() {
    const {playing} = this.refs
    for (const type of [
      'playing', 'pause', 'timeupdate', 'ended', 'error'
    ]) playing.addEventListener(type, this.onAudioEvent)
    playing.volume = this.state.initialVolume
    this.onPlayAction()
  }

  componentWillUnmount() {
    const {playing} = this.refs
    for (const type of [
      'playing', 'pause', 'timeupdate', 'ended', 'error'
    ]) playing.removeEventListener(type, this.onAudioEvent)
  }

  componentDidUpdate(prevProps, prevState) {
    const {playing, preload} = this.refs
    if (this.props.playing.id != prevProps.playing.id ||
        Math.abs(this.props.playing.time - prevProps.playing.time) > 10) {
      const {file, time, player} = this.props.playing
      this.setAudioState(playing, file, time)
      if (file && player && player == this.props.userId) {
        this.props.onPlayOwn(this.props.playing)
      }
    }
    if (this.props.preload != prevProps.preload) {
      const {file} = this.props.preload
      this.setAudioState(preload, file)
    }
  }

  render() {
    const style = this.generateStyle()
    return (
      <div style={style.toolbar}>
        &#8203;
        {
          this.state.isPlaying
            ? <div style={style.label}>
                {Math.floor(this.state.remainingTime / 60)}
                :
                {`00${Math.floor(this.state.remainingTime % 60)}`.substr(-2)}
              </div>
            : null
        }
        <Button
          icon={ThumbDownIcon}
          disabled={this.props.downvote}
          onAction={this.onDownvoteAction}
        />
        {
          this.state.canSetVolume
            ? <Volume
                onChange={this.onVolumeChange}
                initialValue={this.state.initialVolume}
              />
            : null
        }
        {
          this.props.playing.file && !this.state.isPlaying
            ? <Button
                icon={PlayArrowIcon}
                onAction={this.onPlayAction}
              />
            : null
        }
        <audio ref='playing' autoPlay={true} />
        <audio ref='preload' preload='auto' />
      </div>
    )
  }

  generateStyle() {
    return {
      toolbar: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        marginLeft: 12,
        marginRight: 12
      },
      label: {
        fontSize: this.props.muiTheme.appBar.bodyFontSize,
        padding: 12
      }
    }
  }
}
