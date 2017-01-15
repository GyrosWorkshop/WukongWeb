import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import Selector from '../selector'
import SongItem from './song-item'
import style from './song-list.css'

function mapStateToProps(state) {
  return {
    songs: Selector.currentSongs(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class SongList extends PureComponent {
  static propTypes = {
    songs: PropTypes.array
  }

  render() {
    const {songs} = this.props
    return (
      <div styleName='container'>
        {songs.map(({id, title, album, artist, link}) => (
          <SongItem key={id} title={title} album={album} artist={artist}
            link={link}/>
        ))}
      </div>
    )
  }
}
