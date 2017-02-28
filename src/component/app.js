import React, {PureComponent, PropTypes} from 'react'
import {BrowserRouter, Route} from 'react-router-dom'

import Background from './background'
import Notification from './notification'
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
          <Route path='/' exact component={Welcome}/>
          <Route path='/:channel' component={Channel}/>
          <Background/>
          <Notification/>
          {this.props.children}
        </div>
      </BrowserRouter>
    )
  }
}
