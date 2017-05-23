import React, {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'

import style from './song-item.css'

@CSSModules(style)
export default class SongItem extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    album: PropTypes.string,
    artist: PropTypes.string,
    link: PropTypes.string,
    icon: PropTypes.string,
    children: PropTypes.node
  }

  render() {
    const {title, album, artist, link, icon, children} = this.props
    return (
      <div styleName='container'>
        <img src={icon}/>
        <p>
          <a href={link} target='_blank' rel='noopener noreferrer'>{title}</a>
          <span>{artist}{artist && album && ' − '}{album}</span>
        </p>
        {children}
      </div>
    )
  }
}
