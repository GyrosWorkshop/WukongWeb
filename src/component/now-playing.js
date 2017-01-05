import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import style from './now-playing.sss'

function mapStateToProps(state) {
  return {
    title: state.song.playing.title,
    album: state.song.playing.album,
    artist: state.song.playing.artist,
    artwork: state.song.playing.artwork,
    link: state.song.playing.link,
    mvLink: state.song.playing.mvLink,
    connection: state.user.preferences.connection
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class NowPlaying extends Component {
  static propTypes = {
    title: PropTypes.string,
    album: PropTypes.string,
    artist: PropTypes.string,
    artwork: PropTypes.array,
    link: PropTypes.string,
    mvLink: PropTypes.string,
    connection: PropTypes.number
  }

  render() {
    const {title, album, artist, artwork, link, mvLink, connection} = this.props
    return (
      <div styleName='container'>
        <img src={artwork && artwork[connection]}/>
        <p>
          <a href={link} target='_blank'>{title}</a>
          {mvLink && <a href={mvLink} target='_blank'>
            <i className='fa fa-youtube-play'/></a>}
        </p>
        <p>
          <span>{artist}{artist && album && ' — '}{album}</span>
        </p>
      </div>
    )
  }
}
