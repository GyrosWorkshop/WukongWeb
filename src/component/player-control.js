import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import Selector from '../selector'
import style from './player-control.sss'

function mapStateToProps(state) {
  return {
    player: state.player,
    playing: Selector.playingFile(state),
    preload: Selector.preloadFile(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class PlayerControl extends PureComponent {
  static propTypes = {
    player: PropTypes.object,
    playing: PropTypes.object,
    preload: PropTypes.object
  }

  render() {
    return (
      <div styleName='container'></div>
    )
  }
}
