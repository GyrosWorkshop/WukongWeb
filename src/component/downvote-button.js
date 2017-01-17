import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'

import Action from '../action'
import FlatButton from './flat-button'

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

@connect(mapStateToProps, mapDispatchToProps)
export default class DownvoteButton extends PureComponent {
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
      <FlatButton icon='thumbs-o-down' disabled={downvote}
        action={this.onButtonAction}>
        <p>Downvote Song</p>
      </FlatButton>
    )
  }
}
