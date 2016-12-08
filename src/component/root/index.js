import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import stylesheet from './root.scss'

@CSSModules(stylesheet)
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
