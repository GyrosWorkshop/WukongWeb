import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'

import {Selector} from '../client'
import style from './background.css'
import artworkImage from '../resource/artwork.png'

function mapStateToProps(state) {
  return {
    artwork: Selector.playingArtwork(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default
@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
class Background extends PureComponent {
  static propTypes = {
    artwork: PropTypes.string
  }

  render() {
    const {artwork} = this.props
    return (
      <div styleName='container' style={{
        backgroundImage: `url(${artwork || artworkImage})`
      }}/>
    )
  }
}
