import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'

import Action from '../action'
import FlatButton from './flat-button'

function mapStateToProps(state) {
  return {
    format: state.song.playing.format,
    quality: state.song.playing.quality,
    preferred: state.user.preferences.audioQuality
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
export default class QualityButton extends PureComponent {
  static propTypes = {
    format: PropTypes.string,
    quality: PropTypes.object,
    preferred: PropTypes.number,
    dispatchQuality: PropTypes.func
  }

  onButtonAction = (event) => {
    this.props.dispatchQuality((this.props.preferred + 1) % 4)
  }

  render() {
    const {format, quality, preferred} = this.props
    return (
      <FlatButton icon='headphones'
        action={this.onButtonAction}>
        {(format || quality) && <p>
          Playing: {
            format || 'unknown'
          } {
            quality && quality.description
          }
        </p>}
        <p>
          Preferred Quality: {
            ['low', 'medium', 'high', 'lossless'][preferred]
          }
        </p>
      </FlatButton>
    )
  }
}
