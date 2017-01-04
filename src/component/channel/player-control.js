import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import style from './player-control.sss'

@CSSModules(style)
export default class PlayerControl extends Component {
  static propTypes = {
    file: PropTypes.string
  }

  render() {
    return
  }
}
