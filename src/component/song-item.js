import React, {PureComponent, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import style from './song-item.css'

@CSSModules(style)
export default class SongItem extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    album: PropTypes.string,
    artist: PropTypes.string,
    link: PropTypes.string,
    icon: PropTypes.string
  }

  render() {
    const {title, album, artist, link, icon} = this.props
    return (
      <div styleName='container'>
        <img src={icon}/>
        <a href={link} target='_blank'>{title}</a>
        <span>{artist}{artist && album && ' — '}{album}</span>
      </div>
    )
  }
}
