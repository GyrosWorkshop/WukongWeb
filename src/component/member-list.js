import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import Selector from '../selector'
import MemberListItem from './member-list-item'
import style from './member-list.sss'

function mapStateToProps(state) {
  return {
    members: state.channel.members,
    index: Selector.playerIndex(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class MemberList extends PureComponent {
  static propTypes = {
    members: PropTypes.array,
    index: PropTypes.number
  }

  render() {
    const {members, index} = this.props
    return (
      <div styleName='container' style={{
        transition: 'transform 800ms ease',
        transform: 'translateX(50%)' + `translateX(-${
          members[index]
            ? index * 120 + 60
            : members.length * 60
        }px)`
      }}>
        {members.map((member, i) => (
          <MemberListItem key={member.id}
            nickname={member.nickname} avatar={member.avatar}
            style={{
              transition: 'transform 800ms ease',
              transform: index == i
                ? 'scale(1,1)'
                : 'scale(0.8,0.8)'
            }}/>
        ))}
      </div>
    )
  }
}
