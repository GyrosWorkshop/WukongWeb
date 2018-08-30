import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import {Action} from '../client'
import ButtonItem from './button-item'

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchShuffle() {
      dispatch(Action.Song.shuffle.create())
    }
  }
}

export default
@connect(mapStateToProps, mapDispatchToProps)
class ShuffleButton extends PureComponent {
  static propTypes = {
    dispatchShuffle: PropTypes.func
  }

  onButtonAction = (event) => {
    this.props.dispatchShuffle()
  }

  render() {
    return (
      <ButtonItem icon='random' action={this.onButtonAction}>
        <p>Shuffle</p>
      </ButtonItem>
    )
  }
}
