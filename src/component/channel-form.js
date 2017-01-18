import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router'
import CSSModules from 'react-css-modules'

import Action from '../action'
import style from './channel-form.css'

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
    value: ''
  }

  onInputChange = (event) => {
    const value = event.target.value
    this.setState({value})
  }

  onButtonClick = (event) => {
    const {value} = this.state
    if (value) {
      this.props.dispatchChannel(value)
    }
  }

  render() {
    const {channel} = this.props
    const {value} = this.state
    return (
      <div styleName='container'>
        <input value={value} onChange={this.onInputChange}/>
        <button onClick={this.onButtonClick}>
          <i className='fa fa-play'/>
          <span>Wukong</span>
        </button>
        {channel && <Redirect to={{pathname: `/${channel}`}}/>}
      </div>
    )
  }
}
