import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'

import style from './user-view.css'

function mapStateToProps(state) {
  return {
    nickname: state.user.profile.nickname,
    avatar: state.user.profile.avatar
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class UserView extends PureComponent {
  static propTypes = {
    nickname: PropTypes.string,
    avatar: PropTypes.string
  }

  render() {
    const {nickname, avatar} = this.props
    return (
      <div styleName='container'>
        <img src={avatar}/>
        <p>{nickname}</p>
      </div>
    )
  }
}
