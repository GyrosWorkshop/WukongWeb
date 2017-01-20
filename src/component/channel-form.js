import React, {PureComponent} from 'react'
import {Redirect} from 'react-router'
import CSSModules from 'react-css-modules'

import style from './channel-form.css'

@CSSModules(style)
export default class ChannelForm extends PureComponent {
  state = {
    value: '',
    submit: false
  }

  onInputChange = (event) => {
    const {value} = event.target
    this.setState({value})
  }

  onButtonClick = (event) => {
    if (this.state.value) {
      this.setState({submit: true})
    }
  }

  render() {
    const {value, submit} = this.state
    return (
      <div styleName='container'>
        <input value={value} onChange={this.onInputChange}/>
        <button onClick={this.onButtonClick}>
          <i className='fa fa-play'/>
          <span>Wukong</span>
        </button>
        {submit && <Redirect to={{pathname: `/${value}`}}/>}
      </div>
    )
  }
}
