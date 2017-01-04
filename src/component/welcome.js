import React, {Component} from 'react'
import CSSModules from 'react-css-modules'

import UserView from './user-view'
import ChannelForm from './channel-form'
import style from './welcome.sss'

@CSSModules(style)
export default class Welcome extends Component {
  render() {
    return (
      <div styleName='container'>
        <UserView/>
        <ChannelForm/>
      </div>
    )
  }
}
