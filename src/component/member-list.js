import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'

import Selector from '../selector'
import MemberItem from './member-item'
import style from './member-list.css'

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
      <div styleName='container'>
        <div styleName='list' style={{
          transition: 'transform 800ms ease',
          transform: 'translateX(50%)' + `translateX(-${
            members[index] ? index * 120 + 60 : members.length * 60
          }px)`
        }}>
          {members.map(({id, nickname, avatar}, i) => (
            <MemberItem key={id}
              nickname={nickname} avatar={avatar}
              style={{
                transition: 'transform 800ms ease',
                transform: index == i ? 'scale(1,1)' : 'scale(0.8,0.8)'
              }}/>
          ))}
        </div>
      </div>
    )
  }
}
