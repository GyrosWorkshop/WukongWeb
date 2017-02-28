import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import Action from '../action'
import ChannelTitle from './channel-title'
import MemberList from './member-list'
import NowPlaying from './now-playing'
import LyricsMarquee from './lyrics-marquee'
import ActionPanel from './action-panel'
import OmniPanel from './omni-panel'
import SongList from './song-list'
import PlayerAudio from './player-audio'
import style from './channel.css'

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchChannel(channel) {
      dispatch(Action.Channel.name.create(channel))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class Channel extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        channel: PropTypes.string
      })
    }),
    dispatchChannel: PropTypes.func
  }

  updateChannel() {
    this.props.dispatchChannel(this.props.match.params.channel)
  }

  componentDidMount() {
    this.updateChannel()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.params.channel != prevProps.params.channel) {
      this.updateChannel()
    }
  }

  render() {
    return (
      <div styleName='container'>
        <div styleName='left' style={{top: 0}}>
          <ChannelTitle/>
        </div>
        <div styleName='right'>
          <MemberList/>
        </div>
        <div styleName='left' style={{top: 52}}>
          <NowPlaying/>
          <LyricsMarquee/>
          <ActionPanel/>
        </div>
        <div styleName='right'>
          <OmniPanel/>
          <SongList/>
        </div>
        <PlayerAudio/>
      </div>
    )
  }
}
