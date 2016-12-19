import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import style from './member-list.sss'

@CSSModules(style)
export default class MemberList extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div styleName='container'>
        {this.props.children}
      </div>
    )
  }
}
