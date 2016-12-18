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
    this.setState({channel: event.target.value})
  }

  onInputCommit = (event) => {
    if (this.state.channel) {
      this.props.onSubmit(this.state.channel)
    }
  }

  render() {
    return (
      <div styleName='container'>
        <input value={this.state.channel} onChange={this.onInputChange}/>
        <button onTouchTap={this.onInputCommit}>
          <i className='fa fa-play'/>
          <span>Wukong</span>
        </button>
      </div>
    )
  }
}
