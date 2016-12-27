import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router'
import CSSModules from 'react-css-modules'

import Action from '../../action'
import MemberList from './member-list'
import MemberView from './member-view'
import style from './index.sss'

function mapStateToProps(state) {
  return {
    channel: state.channel.name,
    members: state.channel.members,
    player: state.song.playing.player
  }
}

function mapDispatchToProps(dispatch) {
  return {
    exitChannel() {
      dispatch(Action.Channel.name.create(''))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class Channel extends Component {
  static propTypes = {
    channel: PropTypes.string,
    members: PropTypes.arrayOf(PropTypes.object),
    player: PropTypes.string,
    exitChannel: PropTypes.func
  }

  onExitAction = (event) => {
    this.props.exitChannel()
  }

  render() {
    const {channel, members, player} = this.props
    return (
      <div styleName='container'>
        <MemberList highlightIndex={
          members.map(member => member.id).indexOf(player)
        }>
          {members.map(member => (
            <MemberView key={member.id}
              nickname={member.nickname} avatar={member.avatar}/>
          ))}
        </MemberList>
        <p>Channel: {channel}</p>
        <a href='#' onTouchTap={this.onExitAction}>Exit</a>
        {!channel && <Redirect to={{pathname: '/'}}/>}
      </div>
    )
  }
}
