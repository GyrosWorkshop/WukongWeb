import React, {Component} from 'react'
import {Router, Route} from 'react-router'

import Root from './root'
import About from './about'

export default class App extends Component {
  render() {
    return (
      <Router {...this.props}>
        <Route path='/' component={Root}>
          <Route path='about' component={About} />
        </Route>
      </Router>
    )
  }
}
