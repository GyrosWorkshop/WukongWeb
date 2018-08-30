import React, {PureComponent} from 'react'
import {Redirect} from 'react-router-dom'
import CSSModules from 'react-css-modules'

import style from './channel-form.css'

export default
@CSSModules(style)
class ChannelForm extends PureComponent {
  state = {
    value: '',
    submit: false
  }

  onInputChange = (event) => {
    const {value} = event.target
    this.setState({value})
  }

  onKeyDown = (event) => {
    if (event.key == 'Enter') {
      this.setState({submit: !!this.state.value})
    }
  }

  onButtonClick = (event) => {
    this.setState({submit: !!this.state.value})
  }

  render() {
    const {value, submit} = this.state
    return (
      <div styleName='container'>
        <input value={value} placeholder='Channel'
          onChange={this.onInputChange} onKeyDown={this.onKeyDown}/>
        <button onClick={this.onButtonClick}>
          <i className='fa fa-play'/>
          <span>Wukong</span>
        </button>
        {submit && <Redirect to={{pathname: `/${value}`}}/>}
      </div>
    )
  }
}
