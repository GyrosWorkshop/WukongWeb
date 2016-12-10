import React, {Component, PropTypes} from 'react'
import {HashRouter, Match} from 'react-router'

import Root from './root'
import './style.global.sss'

export default class App extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <HashRouter>
        <Root>
          <Match pattern='/' exactly component={() => <div>Home</div>} />
          {this.props.children}
        </Root>
      </HashRouter>
    )
  }
}
