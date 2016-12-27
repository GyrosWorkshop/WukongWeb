import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router'
import CSSModules from 'react-css-modules'

import Action from '../../action'
import UserView from './user-view'
import ChannelForm from './channel-form'
import style from './index.sss'

function mapStateToProps(state) {
  return {
    nickname: state.user.profile.nickname,
    avatar: state.user.profile.avatar,
    channel: state.channel.name
  }
}

function mapDispatchToProps(dispatch) {
  return {
    joinChannel(channel) {
      dispatch(Action.Channel.name.create(channel))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class Welcome extends Component {
  static propTypes = {
    nickname: PropTypes.string,
    avatar: PropTypes.string,
    channel: PropTypes.string,
    joinChannel: PropTypes.func
  }

  render() {
    const {nickname, avatar, channel} = this.props
    return (
      <div styleName='container'>
        <UserView nickname={nickname} avatar={avatar}/>
        <ChannelForm onSubmit={this.props.joinChannel}/>
        {channel && <Redirect to={{pathname: `/${channel}`}}/>}
      </div>
    )
  }
}
