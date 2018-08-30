import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import {Action} from '../client'
import ButtonItem from './button-item'

function mapStateToProps(state) {
  return {
    downvote: state.player.downvote
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchDownvote() {
      dispatch(Action.Player.downvote.create())
    }
  }
}

export default
@connect(mapStateToProps, mapDispatchToProps)
class DownvoteButton extends PureComponent {
  static propTypes = {
    downvote: PropTypes.bool,
    dispatchDownvote: PropTypes.func
  }

  onButtonAction = (event) => {
    this.props.dispatchDownvote()
  }

  render() {
    const {downvote} = this.props
    return (
      <ButtonItem icon='thumbs-o-down' disabled={downvote}
        action={this.onButtonAction}>
        <p>Downvote Song</p>
      </ButtonItem>
    )
  }
}
