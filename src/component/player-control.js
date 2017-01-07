import React, {PureComponent} from 'react'
import CSSModules from 'react-css-modules'

import PlayerControlAudio from './player-control-audio'
import style from './player-control.sss'

@CSSModules(style)
export default class PlayerControl extends PureComponent {
  render() {
    return (
      <div styleName='container'>
        <PlayerControlAudio/>
      </div>
    )
  }
}
