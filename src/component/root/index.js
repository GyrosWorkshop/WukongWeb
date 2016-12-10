import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import style from './style.sss'

@CSSModules(style)
export default class Root extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div styleName='container'>
        {this.props.children}
      </div>
    )
  }
}
