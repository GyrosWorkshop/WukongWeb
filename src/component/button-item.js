import React, {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'

import style from './button-item.css'

export default
@CSSModules(style)
class ButtonItem extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    hidden: PropTypes.bool,
    disabled: PropTypes.bool,
    action: PropTypes.func,
    children: PropTypes.node
  }

  onButtonClick = (event) => {
    const {hidden, disabled, action} = this.props
    if (!hidden && !disabled && action) {
      action()
    }
  }

  render() {
    const {icon, hidden, disabled, children} = this.props
    return !hidden && (
      <div styleName='container'>
        <button disabled={disabled} onClick={this.onButtonClick}>
          <i className={`fa fa-${icon}`}/>
        </button>
        {children && <div styleName='tooltip'>{children}</div>}
      </div>
    )
  }
}
