import React, {Component} from 'react'
import CSSModules from 'react-css-modules'

import style from './style.sss'

@CSSModules(style)
export default class Channel extends Component {
  render() {
    return (
      <div>Channel</div>
    )
  }
}
