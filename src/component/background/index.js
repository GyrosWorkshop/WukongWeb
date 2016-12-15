import React, {Component} from 'react'
import CSSModules from 'react-css-modules'

import style from './style.sss'

@CSSModules(style)
export default class Background extends Component {
  render() {
    return (
      <canvas styleName='canvas'/>
    )
  }
}
