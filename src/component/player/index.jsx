import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import PlayArrowIcon from 'material-ui/svg-icons/av/play-arrow'
import ThumbDownIcon from 'material-ui/svg-icons/action/thumb-down'
import {debounce} from 'lodash'

import Volume from './volume'
import Button from './button'
import Action from '../../action'

const kVolumeKey = 'volume'

function mapStateToProps(state) {
  return {
    playing: state.song.playing,
    preload: state.song.preload,
    userId: state.user.id
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
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Player extends Component {
  static propTypes = {
    playing: PropTypes.object,
    preload: PropTypes.object,
    userId: PropTypes.string,
    onPlayOwn: PropTypes.func,
    onElapsed: PropTypes.func,
    onEnded: PropTypes.func,
    onDownvote: PropTypes.func
  }

  state = {
    initialVolume: parseFloat(localStorage.getItem(kVolumeKey)) || 0.5,
    isPlaying: false,
    canSetVolume: (() => {
      const audio = document.createElement('audio')
      audio.volume = 0
      return audio.volume == 0
    })()
  }

  onPlayAction = (event) => {
    const {playing} = this.refs
    playing.play()
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

  onDownvoteAction = (event) => {
    this.props.onDownvote()
  }

  componentDidMount() {
    const {playing} = this.refs
    playing.volume = this.state.initialVolume
    playing.addEventListener('playing', event => {
      this.setState({isPlaying: true})
    })
    playing.addEventListener('pause', event => {
      this.setState({isPlaying: false})
    })
    playing.addEventListener('timeupdate', event => {
      this.props.onElapsed(playing.currentTime)
    })
    playing.addEventListener('ended', event => {
      playing.src = ''
      this.props.onEnded()
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const {playing, preload} = this.refs
    if (this.props.playing.id != prevProps.playing.id) {
      const {file, time, player} = this.props.playing
      playing.src = file
      playing.currentTime = (Date.now() / 1000) - time
      if (file && player && player == this.props.userId) {
        this.props.onPlayOwn(this.props.playing)
      }
    }
    if (this.props.preload.id != prevProps.preload.id) {
      const {file} = this.props.preload
      preload.src = file
    }
  }

  render() {
    const style = this.generateStyle()
    return (
      <div style={style.toolbar}>
        &#8203;
        <Button
          icon={ThumbDownIcon}
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
      }
    }
  }
}
