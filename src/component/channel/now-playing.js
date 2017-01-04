import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import style from './now-playing.sss'

@CSSModules(style)
export default class NowPlaying extends Component {
  static propTypes = {
    title: PropTypes.string,
    album: PropTypes.string,
    artist: PropTypes.string,
    artwork: PropTypes.string,
    url: PropTypes.string,
    mvUrl: PropTypes.string
  }

  render() {
    const {title, album, artist, artwork, url, mvUrl} = this.props
    return (
      <div styleName='container'>
        <img src={artwork}/>
        <p>
          <a href={url} target='_blank'>{title}</a>
          {mvUrl && <a href={mvUrl} target='_blank'>
            <i className='fa fa-youtube-play'/></a>}
        </p>
        <p>
          <span>{artist}{artist && album && ' — '}{album}</span>
        </p>
      </div>
    )
  }
}
