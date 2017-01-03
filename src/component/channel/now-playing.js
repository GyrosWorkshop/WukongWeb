import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import style from './now-playing.sss'

@CSSModules(style)
export default class NowPlaying extends Component {
  static propTypes = {
    title: PropTypes.string,
    album: PropTypes.string,
    artist: PropTypes.string,
    artwork: PropTypes.string
  }

  render() {
    const {title, album, artist, artwork} = this.props
    return (
      <div styleName='container'>
        <p styleName='title'>{title}</p>
        <p styleName='detail'>{album}</p>
        <p styleName='detail'>{artist}</p>
        <div styleName='image'><img src={artwork}/></div>
      </div>
    )
  }
}
