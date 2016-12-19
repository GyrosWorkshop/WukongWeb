import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import style from './member-view.sss'

@CSSModules(style)
export default class MemberView extends Component {
  static propTypes = {
    nickname: PropTypes.string,
    avatar: PropTypes.string
  }

  render() {
    return (
      <div styleName='container'>
        <img src={this.props.avatar}/>
        <p>{this.props.nickname}</p>
      </div>
    )
  }
}
