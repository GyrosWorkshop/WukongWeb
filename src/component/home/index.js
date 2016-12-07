import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import stylesheet from './home.scss'

@CSSModules(stylesheet)
export default class Home extends Component {
  render() {
    return (
      <div styleName='hello'>Hello World!</div>
    )
  }
}
