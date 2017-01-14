import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import Action from '../action'
import ButtonItem from './button-item'
import ButtonMenu from './button-menu'
import style from './quality-button.css'

function mapStateToProps(state) {
  return {
    format: state.song.playing.format,
    quality: state.song.playing.quality,
    preferredQuality: state.user.preferences.audioQuality
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchQuality(audioQuality) {
      dispatch(Action.User.preferences.create({audioQuality}))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class QualityButton extends PureComponent {
  static propTypes = {
    format: PropTypes.string,
    quality: PropTypes.object,
    preferredQuality: PropTypes.number,
    dispatchQuality: PropTypes.func
  }

  state = {
    open: false
  }

  onOpen = (event) => {
    this.setState({open: true})
  }

  onClose = (event) => {
    this.setState({open: false})
  }

  render() {
    // const {format, quality, preferredQuality} = this.props
    const format = 'mp3'
    const quality = {
      level: 2,
      description: 'high (320kbps)'
    }
    const {open} = this.state
    return (
      <ButtonItem icon='headphones' action={this.onOpen}>
        <ButtonMenu open={open} onClose={this.onClose}>
          <div styleName='container'>
            {format && (
              <p>Audio: {format} {quality && quality.description}</p>
            )}
            {['low', 'medium', 'high', 'lossless']}
          </div>
        </ButtonMenu>
      </ButtonItem>
    )
  }
}
