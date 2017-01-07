import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router'
import CSSModules from 'react-css-modules'

import Action from '../action'
import style from './channel-form.sss'

function mapStateToProps(state) {
  return {
    channel: state.channel.name
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchChannel(channel) {
      dispatch(Action.Channel.name.create(channel))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class ChannelForm extends PureComponent {
  static propTypes = {
    channel: PropTypes.string,
    dispatchChannel: PropTypes.func
  }

  state = {
    input: ''
  }

  onInputChange = (event) => {
    const input = event.target.value
    this.setState({input})
  }

  onInputCommit = (event) => {
    const {input} = this.state
    if (input) {
      this.props.dispatchChannel(input)
    }
  }

  render() {
    const {channel} = this.props
    const {input} = this.state
    return (
      <div styleName='container'>
        <input value={input} onChange={this.onInputChange}/>
        <button onTouchTap={this.onInputCommit}>
          <i className='fa fa-play'/>
          <span>Wukong</span>
        </button>
        {channel && <Redirect to={{pathname: `/${channel}`}}/>}
      </div>
    )
  }
}
