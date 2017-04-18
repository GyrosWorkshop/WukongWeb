import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'

import Selector from '../selector'
import Action from '../action'
import SongItem from './song-item'
import SongButton from './song-button'
import style from './song-list.css'
import neteaseIcon from '../resource/netease.png'
import qqIcon from '../resource/qq.png'
import xiamiIcon from '../resource/xiami.png'

function mapStateToProps(state) {
  return {
    songs: Selector.currentSongs(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchAdd(song) {
      dispatch(Action.Song.add.create(song))
    },
    dispatchRemove(song) {
      dispatch(Action.Song.remove.create(song.id))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class SongList extends PureComponent {
  static propTypes = {
    songs: PropTypes.array,
    dispatchAdd: PropTypes.func,
    dispatchRemove: PropTypes.func
  }

  onUpnextAction = (context) => {
    this.props.dispatchAdd(this.props.songs[context].song)
  }

  onDeleteAction = (context) => {
    this.props.dispatchRemove(this.props.songs[context].song)
  }

  render() {
    const {songs} = this.props
    return (
      <div styleName='container'>
        {songs.map(({
          song: {id, siteId, title, album, artist, link},
          search, added
        }, i) => (
          <SongItem key={id}
            title={title} album={album} artist={artist} link={link}
            icon={{
              'netease-cloud-music': neteaseIcon,
              'QQMusic': qqIcon,
              'Xiami': xiamiIcon
            }[siteId]}>
            {search ? [
              added
                ? <SongButton key='delete' icon='trash'
                    action={this.onDeleteAction} context={i}/>
                : <SongButton key='upnext' icon='plus'
                    action={this.onUpnextAction} context={i}/>
            ] : [
              <SongButton key='upnext' icon='arrow-up'
                action={this.onUpnextAction} context={i}/>,
              <SongButton key='delete' icon='trash'
                action={this.onDeleteAction} context={i}/>
            ]}
          </SongItem>
        ))}
      </div>
    )
  }
}
