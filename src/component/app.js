import React, {PureComponent, PropTypes} from 'react'
import {BrowserRouter, Match} from 'react-router'

import Background from './background'
import Welcome from './welcome'
import Channel from './channel'
import './app.global.css'

export default class App extends PureComponent {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <BrowserRouter>
        <div className='app'>
          <Background/>
          <Match pattern='/' exactly component={Welcome}/>
          <Match pattern='/:channel' component={Channel}/>
          {this.props.children}
        </div>
      </BrowserRouter>
    )
  }
}
