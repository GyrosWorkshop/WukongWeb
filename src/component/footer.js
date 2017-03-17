import React, {PureComponent} from 'react'
import CSSModules from 'react-css-modules'

import {version} from '../../package.json'
import style from './footer.css'

@CSSModules(style)
export default class AppFooter extends PureComponent {
  render() {
    return (
      <div styleName='container'>
        Wukong frontend v{version} · {new Date().toString()}
        { /* TODO: any better text here? - currently for dev */ }
      </div>
    )
  }
}