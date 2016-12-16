import React, {Component} from 'react'
import CSSModules from 'react-css-modules'

import style from './style.sss'

@CSSModules(style)
export default class Welcome extends Component {
  state = {
    channel: ''
  }

  onChannelChange = (event) => {
    this.setState({channel: event.target.value})
  }

  onStartAction = (event) => {
  }

  render() {
    return (
      <div styleName='container'>
        <input styleName='channel-field'
          value={this.state.channel}
          onChange={this.onChannelChange}/>
        <a styleName='start-button'
          onTouchTap={this.onStartAction}>
          <i className='fa fa-play'/> Start
        </a>
      </div>
    )
  }
}
