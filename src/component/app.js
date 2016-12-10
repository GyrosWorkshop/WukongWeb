import React, {Component} from 'react'
import {HashRouter, Match} from 'react-router'

import Root from './root'
import './style.global.sss'

export default class App extends Component {
  render() {
    return (
      <HashRouter>
        <Root {...this.props}>
          <Match pattern='/' exactly component={() => <div>Home</div>} />
        </Root>
      </HashRouter>
    )
  }
}
