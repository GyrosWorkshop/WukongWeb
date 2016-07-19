import React, {Component} from 'react'

import App from './app'

export default class Root extends Component {
  render() {
    if (__env.production) {
      return <App />
    } else {
      const DevTools = require('./devtools').default
      return <div><App /><DevTools /></div>
    }
  }
}
