import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import Selector from '../selector'
import style from './preload-control.css'

function mapStateToProps(state) {
  return {
    artwork: Selector.preloadArtwork(state),
    file: Selector.preloadFile(state).url
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class PreloadControl extends PureComponent {
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
