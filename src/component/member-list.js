import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import MemberListItem from './member-list-item'
import style from './member-list.sss'

function mapStateToProps(state) {
  return {
    members: state.channel.members,
    player: state.song.playing.player
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
    player: PropTypes.string
  }

  render() {
    const {members, player} = this.props
    const highlight = members.map(member => member.id).indexOf(player)
    return (
      <div styleName='container' style={{
        transition: 'transform 800ms ease',
        transform: 'translateX(50%)' + `translateX(-${
          members[highlight]
            ? highlight * 120 + 60
            : members.length * 60
        }px)`
      }}>
        {members.map((member, index) => (
          <MemberListItem key={member.id}
            nickname={member.nickname} avatar={member.avatar}
            style={{
              transition: 'transform 800ms ease',
              transform: highlight == index
                ? 'scale(1,1)'
                : 'scale(0.8,0.8)'
            }}/>
        ))}
      </div>
    )
  }
}
