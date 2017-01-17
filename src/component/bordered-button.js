import React, {PureComponent, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import style from './bordered-button.css'

@CSSModules(style)
export default class BorderedButton extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    disabled: PropTypes.bool,
    action: PropTypes.func
  }

  onButtonAction = (event) => {
    const {disabled, action} = this.props
    if (!disabled && action) {
      action()
    }
  }

  render() {
    const {icon, disabled} = this.props
    return (
      <div styleName='container'>
        <button disabled={disabled} onClick={this.onButtonAction}>
          <i className={`fa fa-${icon}`}/>
        </button>
      </div>
    )
  }
}
