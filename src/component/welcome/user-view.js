import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import style from './user-view.sss'

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
export default class UserView extends Component {
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
