import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import style from './user-view.sss'

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
