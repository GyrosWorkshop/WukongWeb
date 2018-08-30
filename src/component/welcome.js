import React, {PureComponent} from 'react'
import CSSModules from 'react-css-modules'

import UserView from './user-view'
import ChannelForm from './channel-form'
import style from './welcome.css'

export default
@CSSModules(style)
class Welcome extends PureComponent {
  render() {
    return (
      <div styleName='container'>
        <UserView/>
        <ChannelForm/>
      </div>
    )
  }
}
