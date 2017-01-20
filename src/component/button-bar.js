import React, {PureComponent, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import style from './button-bar.css'

@CSSModules(style)
export default class ButtonBar extends PureComponent {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    const {children} = this.props
    return (
      <div styleName='container'>
        {children}
      </div>
    )
  }
}
