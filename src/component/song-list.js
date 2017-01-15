import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import Selector from '../selector'
import style from './song-list.css'

function mapStateToProps(state) {
  return {
    songs: Selector.currentSongs(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class SongList extends PureComponent {
  static propTypes = {
    songs: PropTypes.array
  }

  render() {
    return (
      <div styleName='container'>
      </div>
    )
  }
}
