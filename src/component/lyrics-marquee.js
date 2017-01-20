import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import Selector from '../selector'
import style from './lyrics-marquee.css'

function mapStateToProps(state) {
  return {
    lyrics: Selector.currentLyrics(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class LyricsMarquee extends PureComponent {
  static propTypes = {
    lyrics: PropTypes.array
  }

  render() {
    const {lyrics} = this.props
    return (
      <div styleName='container'>
        {lyrics.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
    )
  }
}
