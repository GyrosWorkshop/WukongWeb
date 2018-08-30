import React, {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'

import style from './member-item.css'

export default
@CSSModules(style)
class MemberItem extends PureComponent {
  static propTypes = {
    nickname: PropTypes.string,
    avatar: PropTypes.string,
    style: PropTypes.object
  }

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
