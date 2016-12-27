import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router'
import CSSModules from 'react-css-modules'

import Action from '../../action'
import MemberList from './member-list'
import MemberView from './member-view'
import NowPlaying from './now-playing'
import style from './index.sss'

function mapStateToProps(state) {
  return {
    channel: state.channel,
    playing: state.song.playing
  }
}

function mapDispatchToProps(dispatch) {
  return {
    exitChannel() {
      dispatch(Action.Channel.name.create(''))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class Channel extends Component {
  static propTypes = {
    channel: PropTypes.object,
    playing: PropTypes.object,
    exitChannel: PropTypes.func
  }

  onExitAction = (event) => {
    this.props.exitChannel()
  }

  render() {
    const {
      channel: {name: channel, members},
      playing: {title, album, artist, artwork, player}
    } = this.props
    return (
      <div styleName='container'>
        <MemberList highlightIndex={
          members.map(member => member.id).indexOf(player)
        }>
          {members.map(member => (
            <MemberView key={member.id}
              nickname={member.nickname} avatar={member.avatar}/>
          ))}
        </MemberList>
        <NowPlaying title={title} album={album} artist={artist}
          artwork={artwork}/>
        <p>Channel: {channel}</p>
        <a href='#' onTouchTap={this.onExitAction}>Exit</a>
        {!channel && <Redirect to={{pathname: '/'}}/>}
      </div>
    )
  }
}
