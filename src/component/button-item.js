import React, {PureComponent, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import style from './button-item.css'

@CSSModules(style)
export default class ButtonItem extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    hidden: PropTypes.bool,
    disabled: PropTypes.bool,
    tooltip: PropTypes.string,
    action: PropTypes.func
  }

  onButtonAction = (event) => {
    const {hidden, disabled, action} = this.props
    if (!hidden && !disabled && action) {
      action()
    }
  }

  render() {
    const {icon, hidden, disabled} = this.props
    return !hidden && (
      <button styleName='button' disabled={disabled}
        onClick={this.onButtonAction}>
        <i className={`fa fa-${icon}`}/>
      </button>
    )
  }
}
