import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import Selector from '../selector'
import style from './preloader.css'

function mapStateToProps(state) {
  return {
    artwork: Selector.preloadArtwork(state),
    audio: Selector.preloadAudioFile(state).url
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class Preloader extends PureComponent {
  static propTypes = {
    artwork: PropTypes.string,
    audio: PropTypes.string
  }

  setAudioState(url) {
    const {audio} = this.refs
    if (url) {
      audio.src = url
    } else {
      audio.removeAttribute('src')
    }
  }

  setImageState(url) {
    const {artwork} = this.refs
    if (url) {
      artwork.src = url
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.audio != nextProps.audio) {
      this.setAudioState(nextProps.audio)
    }
    if (this.props.artwork != nextProps.artwork) {
      this.setImageState(nextProps.artwork)
    }
    return false
  }

  render() {
    return (
      <div styleName='container'>
        <audio ref='audio' preload='auto'/>
        <img ref='artwork'/>
      </div>
    )
  }
}