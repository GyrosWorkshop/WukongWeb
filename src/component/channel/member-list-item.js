import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import style from './member-list-item.sss'

@CSSModules(style)
export default class MemberListItem extends Component {
  static propTypes = {
    nickname: PropTypes.string,
    avatar: PropTypes.string,
    style: PropTypes.object
  }

  //TODO: should update

  render() {
    const {nickname, avatar, style} = this.props
    return (
      <div styleName='container' style={style}>
        <img src={avatar}/>
        <p styleName='tooltip'>{nickname}</p>
      </div>
    )
  }
}
