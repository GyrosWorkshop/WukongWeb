import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import stylesheet from './root.scss'

@CSSModules(stylesheet)
export default class Root extends Component {
  render() {
    return (
      <div styleName='hello'>
        Hello World!!
        {this.props.children}
      </div>
    )
  }
}
