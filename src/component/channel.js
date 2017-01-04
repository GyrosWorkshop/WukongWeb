import React, {Component} from 'react'
import CSSModules from 'react-css-modules'

import MemberList from './member-list'
import NowPlaying from './now-playing'
import PlayerControl from './player-control'
import style from './channel.sss'

@CSSModules(style)
export default class Channel extends Component {
  render() {
    return (
      <div styleName='container'>
        <MemberList/>
        <NowPlaying/>
        <PlayerControl/>
      </div>
    )
  }
}
