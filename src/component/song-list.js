import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

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
    songs: Selector.currentSongs(state),
    search: Selector.currentSearch(state)
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
    search: PropTypes.bool,
    dispatchAdd: PropTypes.func,
    dispatchRemove: PropTypes.func
  }

  onUpnextAction = (context) => {
    this.props.dispatchAdd(this.props.songs[context])
  }

  onDeleteAction = (context) => {
    this.props.dispatchRemove(this.props.songs[context])
  }

  render() {
    const {songs, search} = this.props
    return (
      <div styleName='container'>
        {songs.map(({id, siteId, title, album, artist, link}, i) => (
          <SongItem key={id} title={title} album={album} artist={artist}
            link={link} icon={{
              'netease-cloud-music': neteaseIcon,
              'QQMusic': qqIcon,
              'Xiami': xiamiIcon
            }[siteId]}>
            {search ? [
              <SongButton key='upnext' icon='plus'
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
