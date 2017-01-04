import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import style from './player-control.sss'

function mapStateToProps(state) {
  return {
    playing: state.song.playing.file,
    preload: state.song.preload.file,
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
    playing: PropTypes.object,
    preload: PropTypes.object,
    connection: PropTypes.number
  }

  render() {
    return (
      <div styleName='container'></div>
    )
  }
}
