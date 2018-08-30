import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'

import {Action} from '../client'
import LoginItem from './login-item'
import style from './login-list.css'
import googleIcon from '../resource/google.png'
import microsoftIcon from '../resource/microsoft.png'
import githubIcon from '../resource/github.png'

function mapStateToProps(state) {
  return {
    providers: state.user.auth.providers
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchAuthSelected(provider) {
      dispatch(Action.User.auth.create({selected: provider.id}))
    }
  }
}

export default
@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
class LoginList extends PureComponent {
  static propTypes = {
    providers: PropTypes.array,
    dispatchAuthSelected: PropTypes.func
  }

  onLoginAction = (context) => {
    this.props.dispatchAuthSelected(this.props.providers[context])
  }

  render() {
    const {providers} = this.props
    return (
      <div styleName='container'>
        {(providers || []).map(({id, name}, i) => (
          <LoginItem key={id} name={name}
            icon={{
              'Google': googleIcon,
              'Microsoft': microsoftIcon,
              'GitHub': githubIcon
            }[id]}
            action={this.onLoginAction} context={i}/>
        ))}
      </div>
    )
  }
}
