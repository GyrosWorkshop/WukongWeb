import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'

import Selector from '../selector'
import style from './now-playing.css'

function mapStateToProps(state) {
  return {
    title: state.song.playing.title,
    album: state.song.playing.album,
    artist: state.song.playing.artist,
    artwork: Selector.playingArtwork(state),
    link: state.song.playing.link,
    mvLink: state.song.playing.mvLink
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class NowPlaying extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    album: PropTypes.string,
    artist: PropTypes.string,
    artwork: PropTypes.string,
    link: PropTypes.string,
    mvLink: PropTypes.string
  }

  render() {
    const {title, album, artist, artwork, link, mvLink} = this.props
    return (
      <div styleName='container'>
        <img src={artwork}/>
        <p>
          <a href={link} target='_blank'>{title}</a>
          {mvLink && <a href={mvLink} target='_blank'>
            <i className='fa fa-youtube-play'/>
          </a>}
        </p>
        <p>
          <span>{artist}{artist && album && ' − '}{album}</span>
        </p>
      </div>
    )
  }
}
