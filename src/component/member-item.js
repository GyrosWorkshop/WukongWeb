import React, {PureComponent, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import style from './member-item.css'

@CSSModules(style)
export default class MemberItem extends PureComponent {
  static propTypes = {
    nickname: PropTypes.string,
    avatar: PropTypes.string,
    url: PropTypes.string,
    style: PropTypes.object
  }

  render() {
    const {nickname, avatar, url, style} = this.props
    return (
      <div styleName='container' style={style}>
        <a href={url} target='_blank'>
          <img src={avatar}/>
          <p styleName='tooltip'>{nickname}</p>
        </a>
      </div>
    )
  }
}
