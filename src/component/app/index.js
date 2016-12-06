import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import stylesheet from './app.scss'

@CSSModules(stylesheet)
export default class App extends Component {
  render() {
    return (
      <div styleName='hello'>Hello World!</div>
    )
  }
}
