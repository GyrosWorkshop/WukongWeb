import {PureComponent} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import Selector from '../selector'
import Action from '../action'

function mapStateToProps(state) {
  return {
    id: state.song.playing.id,
    time: state.song.playing.time,
    title: state.song.playing.title,
    album: state.song.playing.album,
    artist: state.song.playing.artist,
    playingArtwork: Selector.playingArtwork(state),
    playingFile: Selector.playingFile(state).url,
    preloadArtwork: Selector.preloadArtwork(state),
    preloadFile: Selector.preloadFile(state).url,
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
export default class PlayerExternal extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    time: PropTypes.number,
    title: PropTypes.string,
    album: PropTypes.string,
    artist: PropTypes.string,
    playingArtwork: PropTypes.string,
    playingFile: PropTypes.string,
    preloadArtwork: PropTypes.string,
    preloadFile: PropTypes.string,
    reload: PropTypes.bool,
    dispatchRunning: PropTypes.func,
    dispatchElapsed: PropTypes.func,
    dispatchDuration: PropTypes.func,
    dispatchEnded: PropTypes.func,
    dispatchReloaded: PropTypes.func
  }

  copyData(props) {
    const object = {}
    Object.keys(props).forEach(key => {
      if (!key.startsWith('dispatch')) {
        object[key] = props[key]
      }
    })
    return object
  }

  receiveMessage(enabled) {
    const object = {}
    Object.keys(this.props).forEach(key => {
      if (key.startsWith('dispatch')) {
        const name = key.substr('dispatch'.length).toLowerCase()
        object[name] = enabled ? this.props[key] : () => {}
      }
    })
    window.webkit.messageEmitters = object
  }

  postMessage(name, body) {
    window.webkit.messageHandlers[name].postMessage(body)
  }

  componentDidMount() {
    this.receiveMessage(true)
    this.postMessage('mount', {
      messageEmitters: 'window.webkit.messageEmitters'
    })
  }

  componentWillUnmount() {
    this.receiveMessage(false)
    this.postMessage('unmount', {})
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.postMessage('update', {
      oldData: this.copyData(this.props),
      newData: this.copyData(nextProps)
    })
    return false
  }

  render() {
    return null
  }
}
