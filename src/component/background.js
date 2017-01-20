import React, {PureComponent} from 'react'
import CSSModules from 'react-css-modules'

import style from './background.css'

@CSSModules(style)
export default class Background extends PureComponent {
  render() {
    return (
      <canvas styleName='canvas'/>
    )
  }
}
