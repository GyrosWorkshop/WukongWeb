import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import style from './channel-form.sss'

@CSSModules(style)
export default class ChannelForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func
  }

  state = {
    channel: ''
  }

  onInputChange = (event) => {
    const channel = event.target.value
    this.setState({channel})
  }

  onInputCommit = (event) => {
    const {channel} = this.state
    if (channel) {
      this.props.onSubmit(channel)
    }
  }

  render() {
    const {channel} = this.state
    return (
      <div styleName='container'>
        <input value={channel} onChange={this.onInputChange}/>
        <button onTouchTap={this.onInputCommit}>
          <i className='fa fa-play'/>
          <span>Wukong</span>
        </button>
      </div>
    )
  }
}
