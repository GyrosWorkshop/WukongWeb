import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import style from './player-control.sss'

//TODO: adopt reselect

function mapStateToProps(state) {
  return {
    player: state.player,
    playing: state.song.playing.files,
    preload: state.song.preload.files,
    audioQuality: state.user.preferences.audioQuality,
    connection: state.user.preferences.connection
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class PlayerControl extends Component {
  static propTypes = {
    player: PropTypes.object,
    playing: PropTypes.array,
    preload: PropTypes.array,
    audioQuality: PropTypes.number,
    connection: PropTypes.number
  }

  render() {
    return (
      <div styleName='container'></div>
    )
  }
}
