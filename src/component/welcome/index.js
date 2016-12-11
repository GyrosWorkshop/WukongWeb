import React, {Component} from 'react'
import CSSModules from 'react-css-modules'

import style from './style.sss'

@CSSModules(style)
export default class Welcome extends Component {
  render() {
    return (
      <div styleName='container'>
        <input />
        <button />
      </div>
    )
  }
}
