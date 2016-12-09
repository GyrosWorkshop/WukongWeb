import React, {Component} from 'react'
import {HashRouter, Match} from 'react-router'

import Root from './root'

export default class App extends Component {
  render() {
    return (
      <HashRouter>
        <Root {...this.props}>
          <Match pattern='/' exactly component={() => <div>Home</div>} />
          <Match pattern='/about' component={() => <div>About</div>} />
        </Root>
      </HashRouter>
    )
  }
}
