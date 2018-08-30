import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'

import {Selector} from '../client'
import style from './player-preload.css'

function mapStateToProps(state) {
  return {
    artwork: Selector.preloadArtwork(state),
    file: Selector.preloadFile(state).url
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default
@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
class PlayerPreload extends PureComponent {
  static propTypes = {
    artwork: PropTypes.string,
    file: PropTypes.string
  }

  render() {
    const {artwork, file} = this.props
    return (
      <div styleName='container'>
        {artwork && <img src={artwork}/>}
        {file && <audio preload='auto' src={file}/>}
      </div>
    )
  }
}
