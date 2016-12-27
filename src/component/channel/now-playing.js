import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import style from './now-playing.sss'

@CSSModules(style)
export default class NowPlaying extends Component {
  static propTypes = {
    title: PropTypes.string,
    album: PropTypes.string,
    artist: PropTypes.string,
    artwork: PropTypes.arrayOf(PropTypes.string)
  }

  render() {
    const {title, album, artist, artwork} = this.props
    return (
      <div>
        <p>{title}</p>
        <p>{album}</p>
        <p>{artist}</p>
        <p>{artwork.join('\n')}</p>
      </div>
    )
  }
}
