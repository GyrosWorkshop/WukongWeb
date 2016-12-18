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
    return (
      <div styleName='container'>
        <UserView nickname={this.props.nickname} avatar={this.props.avatar}/>
        <ChannelForm onSubmit={this.props.joinChannel}/>
        {this.props.channel &&
          <Redirect to={{pathname: `/${this.props.channel}`}}/>}
      </div>
    )
  }
}
