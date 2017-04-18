import React, {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'

import style from './login-item.css'

@CSSModules(style)
export default class LoginItem extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    icon: PropTypes.string,
    action: PropTypes.func,
    context: PropTypes.any
  }

  onClick = (event) => {
    const {action, context} = this.props
    if (action) {
      action(context)
    }
  }

  render() {
    const {name, icon} = this.props
    return (
      <div styleName='container' onClick={this.onClick}>
        <img src={icon}/>
        <p>{name}</p>
      </div>
    )
  }
}
