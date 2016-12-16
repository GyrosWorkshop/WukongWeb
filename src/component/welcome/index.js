import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router'
import CSSModules from 'react-css-modules'

import Action from '../../action'
import style from './style.sss'

function mapStateToProps(state) {
  return {
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
    channel: PropTypes.string,
    joinChannel: PropTypes.func
  }

  state = {
    channel: ''
  }

  onChannelInput = (event) => {
    this.setState({channel: event.target.value})
  }

  onStartAction = (event) => {
    this.props.joinChannel(this.state.channel)
  }

  render() {
    return (
      <div styleName='container'>
        <input styleName='channel-field'
          value={this.state.channel}
          onChange={this.onChannelInput}/>
        <a styleName='start-button'
          onTouchTap={this.onStartAction}>
          <i className='fa fa-play'/> Start
        </a>
        {this.props.channel &&
          <Redirect to={{pathname: `/${this.props.channel}`}}/>}
      </div>
    )
  }
}
