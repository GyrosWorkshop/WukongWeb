import React, {PureComponent} from 'react'
import CSSModules from 'react-css-modules'

import MemberList from './member-list'
import NowPlaying from './now-playing'
import ActionPanel from './action-panel'
import OmniPanel from './omni-panel'
import SongList from './song-list'
import PlayerAudio from './player-audio'
import style from './channel.css'

@CSSModules(style)
export default class Channel extends PureComponent {
  render() {
    return (
      <div styleName='container'>
        <MemberList/>
        <NowPlaying/>
        <ActionPanel/>
        <OmniPanel/>
        <SongList/>
        <PlayerAudio/>
      </div>
    )
  }
}
