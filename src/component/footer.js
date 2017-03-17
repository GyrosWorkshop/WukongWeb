import React, {PureComponent} from 'react'
import CSSModules from 'react-css-modules'

import style from './footer.css'

@CSSModules(style)
export default class AppFooter extends PureComponent {
  render() {
    const {version, buildDate} = __env
    return (
      <div styleName='container'>
        Wukong frontend v{version} · {buildDate}
        { /* TODO: any better text here? - currently for dev */ }
      </div>
    )
  }
}