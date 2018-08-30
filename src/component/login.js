import React, {PureComponent} from 'react'
import CSSModules from 'react-css-modules'

import LoginList from './login-list'
import style from './login.css'

export default
@CSSModules(style)
class Login extends PureComponent {
  render() {
    return (
      <div styleName='container'>
        <div styleName='content'>
          <p>Sign in with</p>
          <LoginList/>
        </div>
      </div>
    )
  }
}
