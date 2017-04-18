import React, {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'

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
