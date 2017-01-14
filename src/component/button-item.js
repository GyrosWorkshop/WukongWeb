import React, {PureComponent, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import style from './button-item.css'

@CSSModules(style)
export default class ButtonItem extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    hidden: PropTypes.bool,
    action: PropTypes.func
  }

  onAction = (event) => {
    this.props.action()
  }

  render() {
    const {icon, hidden} = this.props
    return !hidden && (
      <button styleName='button' onTouchTap={this.onAction}>
        <i className={`fa fa-${icon}`}/>
      </button>
    )
  }
}
