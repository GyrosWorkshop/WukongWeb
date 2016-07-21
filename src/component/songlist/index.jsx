import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import QueueMusicIcon from 'material-ui/svg-icons/av/queue-music'
import DeleteIcon from 'material-ui/svg-icons/action/delete'

import List from './list'
import Action from '../../action'
import artworkImage from '../../resource/artwork.png'

function mapStateToProps(state) {
  return {
    songs: state.song.playlist,
    results: state.search.results,
    keyword: state.search.keyword
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSongUpNext(song) {
      dispatch(Action.Song.prepend.create(song))
    },
    onSongDelete(song) {
      dispatch(Action.Song.remove.create(song))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SongList extends Component {
  static propTypes = {
    songs: PropTypes.arrayOf(PropTypes.object),
    results: PropTypes.arrayOf(PropTypes.object),
    keyword: PropTypes.string,
    onSongUpNext: PropTypes.func,
    onSongDelete: PropTypes.func
  }

  getItems() {
    const siteName = (siteId) => {
      switch (siteId) {
        case 'netease-cloud-music': return '网易云音乐'
        case 'QQMusic': return 'QQ 音乐'
        case 'Xiami': return '虾米音乐'
        default: return ''
      }
    }
    const search = !!this.props.keyword
    return this.props[search ? 'results' : 'songs'].map(song => ({
      key: song.id,
      image: song.artwork || artworkImage,
      text: `${song.title}`,
      detail: `${song.artist} - ${song.album}`,
      extra: siteName(song.siteId),
      actions: search ? [{
        key: 'up-next',
        title: 'Up Next',
        icon: <QueueMusicIcon />,
        callback: event => this.props.onSongUpNext(song)
      }] : [{
        key: 'up-next',
        title: 'Up Next',
        icon: <QueueMusicIcon />,
        callback: event => this.props.onSongUpNext(song)
      }, {
        key: 'delete',
        title: 'Delete',
        icon: <DeleteIcon />,
        callback: event => this.props.onSongDelete(song)
      }]
    }))
  }


  render() {
    return (
      <List items={this.getItems()} />
    )
  }

  generateStyle() {
    return {}
  }
}
